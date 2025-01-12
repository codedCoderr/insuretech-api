import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Product } from './model/product.model';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ResponseService } from '../util/response.service';

@Module({
  imports: [SequelizeModule.forFeature([Product])],
  providers: [ProductService, ResponseService],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule {}
