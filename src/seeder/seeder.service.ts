import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from '../product/model/product.model';
import { User } from '../user/model/user.model';

@Injectable()
export class SeederService {
  constructor(
    @InjectModel(Product) private productModel: typeof Product,
    @InjectModel(User) private userModel: typeof User,
  ) {}

  async seed() {
    await this.seedProducts();
    await this.seedUsers();
  }

  private async seedProducts() {
    const products = [
      {
        name: 'Optimal care mini',
        price: 10000,
        category: 'Health',
      },
      {
        name: 'Optimal care standard',
        price: 20000,
        category: 'Health',
      },
      { name: 'Third-party', price: 5000, category: 'Auto' },
      { name: 'Comprehensive', price: 15000, category: 'Auto' },
    ];

    await Promise.all(
      products.map(async (product) => {
        const existingProduct = await this.productModel.findOne({
          where: { name: product.name },
        });

        if (!existingProduct) {
          await this.productModel.create(product);
        }
      }),
    );
  }

  private async seedUsers() {
    const users = [
      { name: 'John Doe', email: 'john.doe@example.com', walletBalance: 50000 },
      {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        walletBalance: 30000,
      },
    ];
    await this.userModel.bulkCreate(users, { ignoreDuplicates: true });
  }
}
