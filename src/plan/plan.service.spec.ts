import { Test, TestingModule } from '@nestjs/testing';
import { PlanService } from './plan.service';
import { Plan } from './model/plan.model';
import { Product } from '../product/model/product.model';
import { PendingPolicy } from '../policy/model/pending-policy.model';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PurchasePlanDTO } from './dto';

describe('PlanService', () => {
  let service: PlanService;
  let planModel: Partial<Record<keyof typeof Plan, jest.Mock>>;
  let userModel: { findByPk: jest.Mock; save: jest.Mock };
  let productModel: Partial<Record<keyof typeof Product, jest.Mock>>;
  let pendingPolicyModel: Partial<
    Record<keyof typeof PendingPolicy, jest.Mock>
  >;

  beforeEach(async () => {
    planModel = {
      create: jest.fn(),
      findByPk: jest.fn(),
    };

    userModel = {
      findByPk: jest.fn(),
      save: jest.fn(),
    };

    productModel = {
      findByPk: jest.fn(),
    };

    pendingPolicyModel = {
      bulkCreate: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlanService,
        {
          provide: 'PlanRepository',
          useValue: planModel,
        },
        {
          provide: 'UserRepository',
          useValue: userModel,
        },
        {
          provide: 'ProductRepository',
          useValue: productModel,
        },
        {
          provide: 'PendingPolicyRepository',
          useValue: pendingPolicyModel,
        },
      ],
    }).compile();

    service = module.get<PlanService>(PlanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('purchasePlan', () => {
    it('should successfully purchase a plan', async () => {
      const body: PurchasePlanDTO = {
        userId: 123,
        productId: 456,
        quantity: 2,
      };

      const user = { id: 'user123', walletBalance: 100, save: jest.fn() };
      const product = { id: 456, price: 30 };
      const plan = {
        id: 123,
        userId: user.id,
        productId: product.id,
        quantity: body.quantity,
        totalPrice: 60,
      };

      userModel.findByPk = jest.fn().mockResolvedValue(user);
      productModel.findByPk = jest.fn().mockResolvedValue(product);
      planModel.create = jest.fn().mockResolvedValue(plan);
      pendingPolicyModel.bulkCreate = jest.fn();

      const result = await service.purchasePlan(body);

      expect(userModel.findByPk).toHaveBeenCalledWith(body.userId);
      expect(productModel.findByPk).toHaveBeenCalledWith(body.productId);
      expect(user.walletBalance).toBe(40);
      expect(planModel.create).toHaveBeenCalledWith({
        userId: user.id,
        productId: product.id,
        quantity: body.quantity,
        totalPrice: 60,
      });
      expect(pendingPolicyModel.bulkCreate).toHaveBeenCalledWith([
        { planId: plan.id, userId: user.id, productId: product.id },
        { planId: plan.id, userId: user.id, productId: product.id },
      ]);
      expect(result).toEqual(plan);
    });

    it('should throw NotFoundException if user is not found', async () => {
      const body: PurchasePlanDTO = {
        userId: 123,
        productId: 456,
        quantity: 1,
      };
      userModel.findByPk = jest.fn().mockResolvedValue(null);

      await expect(service.purchasePlan(body)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if product is not found', async () => {
      const body: PurchasePlanDTO = {
        userId: 123,
        productId: 456,
        quantity: 1,
      };
      const user = { id: 123, walletBalance: 100, save: jest.fn() };
      userModel.findByPk = jest.fn().mockResolvedValue(user);
      productModel.findByPk = jest.fn().mockResolvedValue(null);

      await expect(service.purchasePlan(body)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if wallet balance is insufficient', async () => {
      const body: PurchasePlanDTO = {
        userId: 123,
        productId: 456,
        quantity: 5,
      };
      const user = { id: 123, walletBalance: 100, save: jest.fn() };
      const product = { id: 456, price: 30 };
      userModel.findByPk = jest.fn().mockResolvedValue(user);
      productModel.findByPk = jest.fn().mockResolvedValue(product);

      await expect(service.purchasePlan(body)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('fetchPendingPolicies', () => {
    it('should successfully fetch pending policies', async () => {
      const planId = '1';
      const plan = {
        id: 1,
        pendingPolicies: [{ id: 'policy1' }, { id: 'policy2' }],
      };

      planModel.findByPk = jest.fn().mockResolvedValue(plan);

      const result = await service.fetchPendingPolicies(planId);

      expect(planModel.findByPk).toHaveBeenCalledWith(1, {
        include: [{ model: PendingPolicy, where: { state: 'unused' } }],
      });
      expect(result).toEqual(plan.pendingPolicies);
    });

    it('should throw BadRequestException if plan ID is invalid', async () => {
      const invalidPlanId = 'abc';

      await expect(service.fetchPendingPolicies(invalidPlanId)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException if plan is not found', async () => {
      const planId = '1';
      planModel.findByPk = jest.fn().mockResolvedValue(null);

      await expect(service.fetchPendingPolicies(planId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
