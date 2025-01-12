import { Table, Column, DataType, Model } from 'sequelize-typescript';

@Table
export class Product extends Model {
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  price: number;

  @Column({ type: DataType.STRING, allowNull: false })
  category: string;
}
