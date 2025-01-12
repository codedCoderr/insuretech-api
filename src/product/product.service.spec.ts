import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { Product } from './model/product.model';

describe('ProductService', () => {
  let service: ProductService;
  let productModel: Partial<Record<keyof typeof Product, jest.Mock>>;

  beforeEach(async () => {
    productModel = {
      findAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: 'ProductRepository',
          useValue: productModel,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllProducts', () => {
    it('should return an array of products', async () => {
      const products = [
        { id: 1, name: 'Product 1' },
        { id: 2, name: 'Product 2' },
      ];

      productModel.findAll = jest.fn().mockResolvedValue(products);

      const result = await service.getAllProducts();

      expect(productModel.findAll).toHaveBeenCalled();
      expect(result).toEqual(products);
    });

    it('should handle errors when fetching products', async () => {
      const error = new Error('Failed to fetch products');
      productModel.findAll = jest.fn().mockRejectedValue(error);

      await expect(service.getAllProducts()).rejects.toThrow(error);
    });
  });
});
