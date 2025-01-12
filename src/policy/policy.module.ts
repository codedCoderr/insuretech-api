import { Module } from '@nestjs/common';
import { PolicyService } from './policy.service';
import { PendingPolicy } from './model/pending-policy.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { Policy } from './model/policy.model';
import { UtilService } from '../util/util.service';
import { Plan } from '../plan/model/plan.model';

@Module({
  imports: [SequelizeModule.forFeature([PendingPolicy, Policy, Plan])],
  providers: [PolicyService, UtilService],
  exports: [PolicyService],
})
export class PolicyModule {}
