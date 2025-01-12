import { Controller, Get, Post, Body, Res, Param } from '@nestjs/common';
import { PlanService } from './plan.service';
import { PurchasePlanDTO } from './dto';
import { ResponseService } from '../util/response.service';
import { Response } from 'express';

@Controller('plan')
export class PlanController {
  constructor(
    private readonly planService: PlanService,
    private readonly responseService: ResponseService,
  ) {}

  @Post('purchase')
  async purchasePlan(
    @Body()
    body: PurchasePlanDTO,
    @Res() res: Response,
  ) {
    try {
      const plan = await this.planService.purchasePlan(body);
      return this.responseService.json(
        res,
        200,
        'Plan purchased successfully',
        plan,
      );
    } catch (error) {
      throw error;
    }
  }

  @Get(':id/pending-policies')
  async fetchPendingPolicies(@Param('id') id: string, @Res() res: Response) {
    try {
      const pendingPolicies = await this.planService.fetchPendingPolicies(id);
      return this.responseService.json(
        res,
        200,
        'Pending policies fetched successfully',
        pendingPolicies,
      );
    } catch (error) {
      throw error;
    }
  }
}
