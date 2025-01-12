import {
  Model,
  Table,
  DataType,
  ForeignKey,
  Column,
  BelongsTo,
} from 'sequelize-typescript';
import { Plan } from '../../plan/model/plan.model';

import { Product } from '../../product/model/product.model';
import { User } from '../../user/model/user.model';

@Table
export class Policy extends Model {
  @ForeignKey(() => Product)
  @Column
  productId: number;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @ForeignKey(() => Plan)
  @Column
  planId: number;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  policyNumber: string;

  @BelongsTo(() => Product)
  product: Product;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Plan)
  plan: Plan;
}
