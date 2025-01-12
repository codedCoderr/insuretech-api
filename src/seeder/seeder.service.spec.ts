import { Test, TestingModule } from '@nestjs/testing';
import { SeederService } from './seeder.service';
import { Product } from '../product/model/product.model';
import { User } from '../user/model/user.model';

describe('SeederService', () => {
  let service: SeederService;
  let productModel: Partial<Record<keyof typeof Product, jest.Mock>>;
  let userModel: Partial<Record<keyof typeof User, jest.Mock>>;

  beforeEach(async () => {
    productModel = {
      findOne: jest.fn(),
      create: jest.fn(),
    };

    userModel = {
      bulkCreate: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeederService,
        {
          provide: 'ProductRepository',
          useValue: productModel,
        },
        {
          provide: 'UserRepository',
          useValue: userModel,
        },
      ],
    }).compile();

    service = module.get<SeederService>(SeederService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('seed', () => {
    it('should call seedProducts and seedUsers', async () => {
      const seedProductsSpy = jest.spyOn(service as any, 'seedProducts');
      const seedUsersSpy = jest.spyOn(service as any, 'seedUsers');

      await service.seed();

      expect(seedProductsSpy).toHaveBeenCalled();
      expect(seedUsersSpy).toHaveBeenCalled();
    });
  });

  describe('seedProducts', () => {
    it('should create new products if they do not exist', async () => {
      const products = [
        { name: 'Optimal care mini', price: 10000, category: 'Health' },
        { name: 'Optimal care standard', price: 20000, category: 'Health' },
        { name: 'Third-party', price: 5000, category: 'Auto' },
        { name: 'Comprehensive', price: 15000, category: 'Auto' },
      ];

      productModel.findOne = jest.fn().mockImplementation(async ({}) => {
        return null;
      });

      await service['seedProducts']();

      expect(productModel.create).toHaveBeenCalledTimes(products.length);
      products.forEach((product) => {
        expect(productModel.create).toHaveBeenCalledWith(product);
      });
    });

    it('should not create products that already exist', async () => {
      const existingProduct = {
        name: 'Optimal care mini',
        price: 10000,
        category: 'Health',
      };

      productModel.findOne = jest.fn().mockImplementation(async ({}) => {
        return existingProduct;
      });

      await service['seedProducts']();

      expect(productModel.create).toHaveBeenCalledTimes(0);
    });
  });

  describe('seedUsers', () => {
    it('should bulk create users', async () => {
      const users = [
        {
          name: 'John Doe',
          email: 'john.doe@example.com',
          walletBalance: 50000,
        },
        {
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          walletBalance: 30000,
        },
      ];

      await service['seedUsers']();

      expect(userModel.bulkCreate).toHaveBeenCalledWith(users, {
        ignoreDuplicates: true,
      });
    });
  });
});
