import { Model, Column, DataType, HasMany, Table } from 'sequelize-typescript';
import { Plan } from '../../plan/model/plan.model';
import { Policy } from '../../policy/model/policy.model';

@Table
export class User extends Model {
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  email: string;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  walletBalance: number;

  @HasMany(() => Plan)
  plans: Plan[];

  @HasMany(() => Policy)
  policies: Policy[];
}
