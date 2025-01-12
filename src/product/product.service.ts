import { Injectable } from '@nestjs/common';
import { Product } from './model/product.model';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class ProductService {
  constructor(@InjectModel(Product) private productModel: typeof Product) {}

  async getAllProducts() {
    return this.productModel.findAll();
  }
}
