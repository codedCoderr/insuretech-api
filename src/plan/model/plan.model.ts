import {
  Model,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Table,
  BelongsTo,
} from 'sequelize-typescript';

import { PendingPolicy } from '../../policy/model/pending-policy.model';
import { Product } from '../../product/model/product.model';
import { User } from '../../user/model/user.model';

@Table
export class Plan extends Model {
  @ForeignKey(() => Product)
  @Column
  productId: number;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    validate: { min: 1 },
  })
  quantity: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  totalPrice: number;

  @BelongsTo(() => Product)
  product: Product;

  @BelongsTo(() => User)
  user: User;

  @HasMany(() => PendingPolicy)
  pendingPolicies: PendingPolicy[];
}
