import { Test, TestingModule } from '@nestjs/testing';
import { PolicyController } from './policy.controller';
import { PolicyService } from './policy.service';
import { ResponseService } from '../util/response.service';
import { Response } from 'express';

describe('PolicyController', () => {
  let controller: PolicyController;
  let policyService: PolicyService;
  let responseService: ResponseService;
  let mockResponse: Partial<Response>;

  beforeEach(async () => {
    mockResponse = {
      json: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PolicyController],
      providers: [
        {
          provide: PolicyService,
          useValue: {
            activatePendingPolicy: jest.fn(),
            fetchActivatedPolicies: jest.fn(),
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

    controller = module.get<PolicyController>(PolicyController);
    policyService = module.get<PolicyService>(PolicyService);
    responseService = module.get<ResponseService>(ResponseService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('activatePendingPolicy', () => {
    it('should activate a pending policy successfully', async () => {
      const body = { pendingPolicyId: 1 };
      const policy = { id: 1, status: 'activated' };
      policyService.activatePendingPolicy = jest.fn().mockResolvedValue(policy);

      await controller.activatePendingPolicy(body, mockResponse as Response);

      expect(policyService.activatePendingPolicy).toHaveBeenCalledWith(
        body.pendingPolicyId,
      );
      expect(responseService.json).toHaveBeenCalledWith(
        mockResponse,
        200,
        'Policy activated successfully',
        policy,
      );
    });

    it('should handle errors when activating a pending policy', async () => {
      const body = { pendingPolicyId: 1 };
      const error = new Error('Failed to activate policy');
      policyService.activatePendingPolicy = jest.fn().mockRejectedValue(error);

      await expect(
        controller.activatePendingPolicy(body, mockResponse as Response),
      ).rejects.toThrow(error);
    });
  });

  describe('fetchActivatedPolicies', () => {
    it('should fetch activated policies successfully', async () => {
      const activatedPolicies = [{ id: 1, status: 'activated' }];
      const planId = 1;
      policyService.fetchActivatedPolicies = jest
        .fn()
        .mockResolvedValue(activatedPolicies);

      await controller.fetchActivatedPolicies(mockResponse as Response, planId);

      expect(policyService.fetchActivatedPolicies).toHaveBeenCalledWith(planId);
      expect(responseService.json).toHaveBeenCalledWith(
        mockResponse,
        200,
        'Activated policies fetched successfully',
        activatedPolicies,
      );
    });

    it('should handle errors when fetching activated policies', async () => {
      const error = new Error('Failed to fetch activated policies');
      policyService.fetchActivatedPolicies = jest.fn().mockRejectedValue(error);

      await expect(
        controller.fetchActivatedPolicies(mockResponse as Response),
      ).rejects.toThrow(error);
    });
  });
});
