import { Module } from '@nestjs/common';
import { PlanController } from './plan.controller';
import { Product } from '../product/model/product.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { Plan } from './model/plan.model';
import { User } from '../user/model/user.model';
import { PendingPolicy } from '../policy/model/pending-policy.model';
import { PlanService } from './plan.service';
import { ResponseService } from '../util/response.service';

@Module({
  imports: [SequelizeModule.forFeature([Plan, User, Product, PendingPolicy])],
  providers: [PlanService, ResponseService],
  controllers: [PlanController],
  exports: [PlanService],
})
export class PlanModule {}
