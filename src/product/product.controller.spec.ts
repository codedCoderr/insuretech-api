import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ResponseService } from '../util/response.service';
import { Response } from 'express';

describe('ProductController', () => {
  let controller: ProductController;
  let productService: ProductService;
  let responseService: ResponseService;
  let mockResponse: Partial<Response>;

  beforeEach(async () => {
    mockResponse = {
      json: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: {
            getAllProducts: jest.fn(),
          },
        },
        {
          provide: ResponseService,
          useValue: {
            json: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    productService = module.get<ProductService>(ProductService);
    responseService = module.get<ResponseService>(ResponseService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProducts', () => {
    it('should return products successfully', async () => {
      const products = [
        { id: 1, name: 'Product 1' },
        { id: 2, name: 'Product 2' },
      ];
      productService.getAllProducts = jest.fn().mockResolvedValue(products);

      await controller.getProducts(mockResponse as Response);

      expect(productService.getAllProducts).toHaveBeenCalled();
      expect(responseService.json).toHaveBeenCalledWith(
        mockResponse,
        200,
        'Products fetched successfully',
        products,
      );
    });

    it('should handle errors when fetching products', async () => {
      const error = new Error('Failed to fetch products');
      productService.getAllProducts = jest.fn().mockRejectedValue(error);

      await expect(
        controller.getProducts(mockResponse as Response),
      ).rejects.toThrow(error);
    });
  });
});
