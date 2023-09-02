import { Test, TestingModule } from '@nestjs/testing';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { ProductsService } from 'src/products/products.service';

describe('UsersResolver', () => {
  let resolver: UsersResolver;
  
  const userServiceMock = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn()
  };
  
  const productService = {
    findAllByUserId: jest.fn()
    
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersResolver, 
        {
          provide: UsersService,
          useValue: {

          }
        },
        {
          provide: ProductsService,
          useValue: {
            
          }
        }
      ],
    }).compile();

    resolver = module.get<UsersResolver>(UsersResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('resolve field', () => {
    it('should resolve orders', async () => {

    });
  });

  describe('queries', () => {

  });

  describe('mutations', () => {

  });
});
