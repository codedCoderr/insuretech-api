import { Test, TestingModule } from '@nestjs/testing';
import { PolicyService } from './policy.service';
import { Plan } from '../plan/model/plan.model';
import { UtilService } from '../util/util.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Product } from '../product/model/product.model';

describe('PolicyService', () => {
  let service: PolicyService;
  let pendingPolicyModel: {
    findByPk: jest.Mock;
    save: jest.Mock;
    deletedAt?: Date;
  };
  let policyModel: {
    findOne: jest.Mock;
    create: jest.Mock;
    findAll: jest.Mock;
  };
  let planModel: {
    findByPk: jest.Mock;
  };
  let utilService: {
    generatePolicyNumber: jest.Mock;
  };

  beforeEach(async () => {
    pendingPolicyModel = {
      findByPk: jest.fn(),
      save: jest.fn(),
      deletedAt: undefined,
    };

    policyModel = {
      findOne: jest.fn(),
      create: jest.fn(),
      findAll: jest.fn(),
    };

    planModel = {
      findByPk: jest.fn(),
    };

    utilService = {
      generatePolicyNumber: jest.fn().mockReturnValue('POLICY123'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PolicyService,
        {
          provide: 'PendingPolicyRepository',
          useValue: pendingPolicyModel,
        },
        {
          provide: 'PolicyRepository',
          useValue: policyModel,
        },
        {
          provide: 'PlanRepository',
          useValue: planModel,
        },
        {
          provide: UtilService,
          useValue: utilService,
        },
      ],
    }).compile();

    service = module.get<PolicyService>(PolicyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('activatePendingPolicy', () => {
    it('should activate a pending policy successfully', async () => {
      const pendingPolicyId = 1;
      const pendingPolicy = {
        id: pendingPolicyId,
        userId: 1,
        productId: 1,
        planId: 1,
        state: 'pending',
        save: jest.fn(),
        deletedAt: undefined,
      };

      pendingPolicyModel.findByPk.mockResolvedValue(pendingPolicy);
      policyModel.findOne.mockResolvedValue(null); // No existing policy

      const createdPolicy = {
        id: 1,
        policyNumber: 'POLICY123',
        userId: pendingPolicy.userId,
        productId: pendingPolicy.productId,
        planId: pendingPolicy.planId,
      };

      policyModel.create.mockResolvedValue(createdPolicy); // Mock the created policy

      const result = await service.activatePendingPolicy(pendingPolicyId);

      expect(pendingPolicyModel.findByPk).toHaveBeenCalledWith(pendingPolicyId);
      expect(policyModel.findOne).toHaveBeenCalledWith({
        where: {
          userId: pendingPolicy.userId,
          productId: pendingPolicy.productId,
        },
      });
      expect(policyModel.create).toHaveBeenCalledWith({
        policyNumber: 'POLICY123',
        userId: pendingPolicy.userId,
        productId: pendingPolicy.productId,
        planId: pendingPolicy.planId,
      });
      expect(pendingPolicy.state).toBe('used');
      expect(pendingPolicy.deletedAt).toBeDefined();
      expect(result).toEqual(
        expect.objectContaining({ userId: 1, productId: 1 }),
      ); // Ensure this matches the expected output
    });

    it('should throw BadRequestException if pendingPolicyId is invalid', async () => {
      await expect(service.activatePendingPolicy(NaN)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.activatePendingPolicy(null)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException if pending policy is not found', async () => {
      const pendingPolicyId = 1;
      pendingPolicyModel.findByPk.mockResolvedValue(null);

      await expect(
        service.activatePendingPolicy(pendingPolicyId),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if user already has a policy for this product', async () => {
      const pendingPolicyId = 1;
      const pendingPolicy = {
        id: pendingPolicyId,
        userId: 1,
        productId: 1,
        planId: 1,
        state: 'pending',
        save: jest.fn(),
        deletedAt: undefined,
      };

      pendingPolicyModel.findByPk.mockResolvedValue(pendingPolicy);
      policyModel.findOne.mockResolvedValue({}); // Existing policy found

      await expect(
        service.activatePendingPolicy(pendingPolicyId),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('fetchActivatedPolicies', () => {
    it('should fetch activated policies successfully', async () => {
      const activatedPolicies = [{ id: 1, userId: 1, productId: 1 }];
      policyModel.findAll.mockResolvedValue(activatedPolicies);

      const result = await service.fetchActivatedPolicies();

      expect(policyModel.findAll).toHaveBeenCalledWith({
        where: {},
        include: [Product, Plan],
      });
      expect(result).toEqual(activatedPolicies);
    });

    it('should fetch activated policies filtered by planId', async () => {
      const planId = 1;
      const activatedPolicies = [{ id: 1, userId: 1, productId: 1 }];
      policyModel.findAll.mockResolvedValue(activatedPolicies);
      planModel.findByPk.mockResolvedValue({}); // Mock plan found

      const result = await service.fetchActivatedPolicies(planId);

      expect(planModel.findByPk).toHaveBeenCalledWith(planId);
      expect(policyModel.findAll).toHaveBeenCalledWith({
        where: { planId },
        include: [Product, Plan],
      });
      expect(result).toEqual(activatedPolicies);
    });

    it('should throw BadRequestException if planId is not a valid number', async () => {
      await expect(service.fetchActivatedPolicies(NaN)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException if planId is provided but not found', async () => {
      const planId = 1;
      planModel.findByPk.mockResolvedValue(null); // Mock plan not found

      await expect(service.fetchActivatedPolicies(planId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
