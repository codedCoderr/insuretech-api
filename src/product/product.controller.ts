import { Controller, Get, Res } from '@nestjs/common';
import { ProductService } from './product.service';
import { Response } from 'express';
import { ResponseService } from '../util/response.service';

@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly responseService: ResponseService,
  ) {}

  @Get()
  async getProducts(@Res() res: Response) {
    try {
      const products = await this.productService.getAllProducts();
      return this.responseService.json(
        res,
        200,
        'Products fetched successfully',
        products,
      );
    } catch (error) {
      throw error;
    }
  }
}
