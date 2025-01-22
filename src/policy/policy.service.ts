import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PendingPolicy } from './model/pending-policy.model';
import { Policy } from './model/policy.model';
import { UtilService } from '../util/util.service';
import { Product } from '../product/model/product.model';
import { Plan } from '../plan/model/plan.model';

@Injectable()
export class PolicyService {
  constructor(
    @InjectModel(PendingPolicy)
    private pendingPolicyModel: typeof PendingPolicy,
    @InjectModel(Policy) private policyModel: typeof Policy,
    @InjectModel(Plan) private planModel: typeof Plan,

    private utilService: UtilService,
  ) {}

  async activatePendingPolicy(pendingPolicyId: number) {
    if (!pendingPolicyId || isNaN(pendingPolicyId)) {
      throw new BadRequestException(
        'Pending policy ID is required and must be a valid number',
      );
    }
    const pendingPolicy =
      await this.pendingPolicyModel.findByPk(pendingPolicyId);
    if (!pendingPolicy) throw new NotFoundException('Pending policy not found');

    const existingPolicy = await this.policyModel.findOne({
      where: {
        userId: pendingPolicy.userId,
        productId: pendingPolicy.productId,
      },
    });

    if (existingPolicy) {
      throw new BadRequestException(
        'User already has a policy for this product',
      );
    }

    const policyNumber = this.utilService.generatePolicyNumber();

    const policy = await this.policyModel.create({
      policyNumber,
      userId: pendingPolicy.userId,
      productId: pendingPolicy.productId,
      planId: pendingPolicy.planId,
    });

    pendingPolicy.state = 'used';
    pendingPolicy.deletedAt = new Date();

    await pendingPolicy.save();

    return policy;
  }

  async fetchActivatedPolicies(planId?: number) {
    if (!planId || isNaN(planId)) {
      throw new BadRequestException('Plan ID must be a valid number');
    }
    if (planId) {
      const plan = await this.planModel.findByPk(planId);
      if (!plan) throw new NotFoundException('Plan not found');
    }

    const where: any = planId ? { planId } : {};

    return this.policyModel.findAll({
      where,
      include: [Product, Plan],
    });
  }
}
