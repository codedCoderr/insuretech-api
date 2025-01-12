import { Controller, Post, Res, Body, Get, Query } from '@nestjs/common';
import { ResponseService } from '../util/response.service';
import { PolicyService } from './policy.service';
import { Response } from 'express';

@Controller('policy')
export class PolicyController {
  constructor(
    private readonly policyService: PolicyService,
    private readonly responseService: ResponseService,
  ) {}

  @Post('activate')
  async activatePendingPolicy(
    @Body()
    body: { pendingPolicyId: number },
    @Res() res: Response,
  ) {
    try {
      const policy = await this.policyService.activatePendingPolicy(
        body.pendingPolicyId,
      );
      return this.responseService.json(
        res,
        200,
        'Policy activated successfully',
        policy,
      );
    } catch (error) {
      throw error;
    }
  }

  @Get('')
  async fetchActivatedPolicies(
    @Res() res: Response,
    @Query('planId') planId?: number,
  ) {
    try {
      const activatedPolicies =
        await this.policyService.fetchActivatedPolicies(planId);
      return this.responseService.json(
        res,
        200,
        'Activated policies fetched successfully',
        activatedPolicies,
      );
    } catch (error) {
      throw error;
    }
  }
}
