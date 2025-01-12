import {
  ForeignKey,
  Table,
  Column,
  DataType,
  Model,
  BelongsTo,
} from 'sequelize-typescript';

import { Plan } from '../../plan/model/plan.model';
import { User } from '../../user/model/user.model';
import { Product } from '../../product/model/product.model';

@Table
export class PendingPolicy extends Model {
  @ForeignKey(() => Plan)
  @Column
  planId: number;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @ForeignKey(() => Product)
  @Column
  productId: number;

  @Column({ type: DataType.STRING, defaultValue: 'unused' })
  state: string;

  @Column({ type: DataType.DATE, allowNull: true })
  deletedAt: Date;

  @BelongsTo(() => Plan)
  plan: Plan;
}
