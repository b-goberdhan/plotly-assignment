import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { User } from '../users/entities/user.entity';
import { CreateProductInput } from './dto/create-product.input';
import { ProductDto } from './dto/product.dto';

describe('ProductsService', () => {
  let service: ProductsService;
  const testProductId1 = "40134b1d-8d92-4288-8acd-cee7df2b9648";
  const testProductId2 = "40134b1d-8d92-4288-8acd-cee7df2b9648";
  const productRepositoryMock = {
    save: jest.fn(),
    find: jest.fn(),
    findByOne: jest.fn(),
    delete: jest.fn(),
  };

  const userRepositoryMock = {
    findOne: jest.fn(),
  }
  beforeEach(async () => {
    jest.resetAllMocks()
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { 
          provide: getRepositoryToken(Product),
          useValue: productRepositoryMock
        },
        { 
          provide: getRepositoryToken(User),
          useValue: userRepositoryMock
        }
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {

    expect(service).toBeDefined();
  });

  it('should create a product', async () => {
    const createProductInput: CreateProductInput = {
      price: 1.20,
      name: "my test product",
    };

    productRepositoryMock.save.mockResolvedValue({
      id: testProductId1,
      ...createProductInput
    });

    const result = await service.create(createProductInput);

    expect(productRepositoryMock.save).toHaveBeenCalledTimes(1);
    expect(productRepositoryMock.save).toHaveBeenCalledWith({
      ...createProductInput
    });

    expect(result).toEqual({
      id: testProductId1,
      ...createProductInput
    })

  });

  it('should findAll products', async () => {
    const products: Product[] = [
      {
        id: testProductId1,
        name: "test-product-1",
        price: 4.21
      },
      {
        id: testProductId2,
        name: "test-product-1",
        price: 4.21
      }
    ];
    
    productRepositoryMock.find.mockResolvedValue(products);

    const result = await service.findAll();
    expect(productRepositoryMock.find).toHaveBeenCalledTimes(1);
    expect(productRepositoryMock.find).toHaveBeenCalledWith();
    
    expect(result).toEqual([...products] as ProductDto[]);
    
  });

  it('should findOne product', async() => {
    
  });
});
