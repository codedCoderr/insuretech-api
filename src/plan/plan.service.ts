import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Plan } from './model/plan.model';
import { User } from '../user/model/user.model';
import { Product } from '../product/model/product.model';
import { PendingPolicy } from '../policy/model/pending-policy.model';
import { PurchasePlanDTO } from './dto';

@Injectable()
export class PlanService {
  constructor(
    @InjectModel(Plan) private planModel: typeof Plan,
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(Product) private productModel: typeof Product,
    @InjectModel(PendingPolicy)
    private pendingPolicyModel: typeof PendingPolicy,
  ) {}

  async purchasePlan(body: PurchasePlanDTO) {
    const { userId, productId, quantity } = body;
    const user = await this.userModel.findByPk(userId);
    if (!user) throw new NotFoundException('User not found');

    const product = await this.productModel.findByPk(productId);
    if (!product) throw new NotFoundException('Product not found');

    const totalCost = product.price * quantity;
    if (user.walletBalance < totalCost)
      throw new BadRequestException('Insufficient wallet balance');

    user.walletBalance -= totalCost;
    await user.save();

    const plan = await this.planModel.create({
      userId: user.id,
      productId: product.id,
      quantity: quantity,
      totalPrice: totalCost,
    });

    const pendingPolicies = Array.from({ length: quantity }).map(() => ({
      planId: plan.id,
      userId: user.id,
      productId: product.id,
    }));

    await this.pendingPolicyModel.bulkCreate(pendingPolicies);

    return plan;
  }

  async fetchPendingPolicies(planId: string) {
    const numericPlanId = Number(planId);

    if (!numericPlanId || isNaN(numericPlanId)) {
      throw new BadRequestException(
        'Plan ID is required and must be a valid number',
      );
    }

    const plan = await this.planModel.findByPk(numericPlanId, {
      include: [
        {
          model: PendingPolicy,
          where: { state: 'unused' },
        },
      ],
    });

    if (!plan) throw new NotFoundException('Plan not found');

    return plan.pendingPolicies;
  }
}
