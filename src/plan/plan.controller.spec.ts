import { Test, TestingModule } from '@nestjs/testing';
import { PlanController } from './plan.controller';
import { PlanService } from './plan.service';
import { ResponseService } from '../util/response.service';
import { Response } from 'express';
import { PurchasePlanDTO } from './dto';

describe('PlanController', () => {
  let controller: PlanController;
  let planService: PlanService;
  let responseService: ResponseService;
  let mockResponse: Partial<Response>;

  beforeEach(async () => {
    mockResponse = {
      json: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlanController],
      providers: [
        {
          provide: PlanService,
          useValue: {
            purchasePlan: jest.fn(),
            fetchPendingPolicies: jest.fn(),
          },
        },
        {
          provide: ResponseService,
          useValue: {
            json: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PlanController>(PlanController);
    planService = module.get<PlanService>(PlanService);
    responseService = module.get<ResponseService>(ResponseService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('purchasePlan', () => {
    it('should successfully purchase a plan', async () => {
      const body: PurchasePlanDTO = {
        userId: 123,
        productId: 456,
        quantity: 1,
      };
      const plan = {
        id: 1,
        userId: 1,
        productId: 3,
        quantity: 2,
        totalPrice: 10000,
        updatedAt: '2025-01-11T08:19:52.884Z',
        createdAt: '2025-01-11T08:19:52.884Z',
      };
      planService.purchasePlan = jest.fn().mockResolvedValue(plan);

      await controller.purchasePlan(body, mockResponse as Response);

      expect(planService.purchasePlan).toHaveBeenCalledWith(body);
      expect(responseService.json).toHaveBeenCalledWith(
        mockResponse,
        200,
        'Plan purchased successfully',
        plan,
      );
    });

    it('should handle errors when purchasing a plan', async () => {
      const body: PurchasePlanDTO = {
        userId: 123,
        productId: 456,
        quantity: 1,
      };
      const error = new Error('Purchase failed');
      planService.purchasePlan = jest.fn().mockRejectedValue(error);

      await expect(
        controller.purchasePlan(body, mockResponse as Response),
      ).rejects.toThrow(error);
    });
  });

  describe('fetchPendingPolicies', () => {
    it('should successfully fetch pending policies', async () => {
      const id = '123';
      const pendingPolicies = [
        {
          id: 2,
          planId: 1,
          userId: 1,
          productId: 3,
          state: 'unused',
          deletedAt: null,
          createdAt: '2025-01-11T08:19:52.890Z',
          updatedAt: '2025-01-11T08:19:52.890Z',
        },
      ];
      planService.fetchPendingPolicies = jest
        .fn()
        .mockResolvedValue(pendingPolicies);

      await controller.fetchPendingPolicies(id, mockResponse as Response);

      expect(planService.fetchPendingPolicies).toHaveBeenCalledWith(id);
      expect(responseService.json).toHaveBeenCalledWith(
        mockResponse,
        200,
        'Pending policies fetched successfully',
        pendingPolicies,
      );
    });

    it('should handle errors when fetching pending policies', async () => {
      const id = '123';
      const error = new Error('Fetch failed');
      planService.fetchPendingPolicies = jest.fn().mockRejectedValue(error);

      await expect(
        controller.fetchPendingPolicies(id, mockResponse as Response),
      ).rejects.toThrow(error);
    });
  });
});
