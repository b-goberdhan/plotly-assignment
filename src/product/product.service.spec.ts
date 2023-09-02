import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { UserEntity } from '../user/entities/user.entity';
import { CreateProductInput } from './dto/create-product.input';
import { ProductDto } from './dto/product.dto';
import { UpdateProductInput } from './dto/update-product.input';

describe('ProductsService', () => {
  let service: ProductService;
  const testProductId1 = "40134b1d-8d92-4288-8acd-cee7df2b9649";
  const testProductId2 = "50134b1d-8d92-4288-8acd-cee7df2b9648";

  const productRepositoryMock = {
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    delete: jest.fn(),
  };

  const userRepositoryMock = {
    findOne: jest.fn(),
  }


  beforeEach(async () => {
    jest.resetAllMocks()
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        { 
          provide: getRepositoryToken(ProductEntity),
          useValue: productRepositoryMock
        },
        { 
          provide: getRepositoryToken(UserEntity),
          useValue: userRepositoryMock
        }
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
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
    expect(productRepositoryMock.save).toHaveBeenCalledWith({ ...createProductInput });
    expect(result).toStrictEqual({
      id: testProductId1,
      ...createProductInput
    })

  });

  it('should findAll products', async () => {
    const products: ProductEntity[] = [
      {
        id: testProductId1,
        name: "test-product-1",
        price: 4.21
      },
      {
        id: testProductId2,
        name: "test-product-2",
        price: 5.21
      }
    ];
    
    productRepositoryMock.find.mockResolvedValue(products);

    const result = await service.findAll();
    expect(productRepositoryMock.find).toHaveBeenCalledTimes(1);
    expect(productRepositoryMock.find).toHaveBeenCalledWith();
    
    expect(result).toStrictEqual([...products]);
    
  });

  it('should findOne product', async () => {
    const product: ProductEntity = {
      id: testProductId1,
      name: "test-product-1",
      price: 1.23
    }
    productRepositoryMock.findOneBy.mockResolvedValue(product)

    const result = await service.findOne(testProductId1);
    
    expect(productRepositoryMock.findOneBy).toHaveBeenCalledTimes(1);
    expect(productRepositoryMock.findOneBy).toHaveBeenCalledWith({ id: testProductId1});

    expect(result).toStrictEqual({...product} as ProductDto);
  });

  describe("update product", () => {
    it('should update product', async () => {
      
      const updatedProductInput: UpdateProductInput = {
        id: testProductId1,
        name: "test-product-1-updated",
      }

      const product: ProductEntity = {
        id: testProductId1,
        name: "test-product-1",
        price: 1.00
      }
      
      const expectedResult: ProductDto = {
        id: updatedProductInput.id,
        name: updatedProductInput.name, 
        price: 1.00
      }
      productRepositoryMock.findOneBy.mockResolvedValue(product);
      
      const result = await service.update(updatedProductInput);
      expect(productRepositoryMock.findOneBy).toHaveBeenCalledTimes(1);
      expect(productRepositoryMock.findOneBy).toHaveBeenCalledWith({ id: updatedProductInput.id });
      
      expect(productRepositoryMock.save).toHaveBeenCalledWith(expectedResult);

      expect(result).toStrictEqual({ ...expectedResult });

    });

    it('should handled product not found', async () => {
      const updatedProductInput: UpdateProductInput = {
        id: testProductId1,
        name: "test-product-1-updated",
      }

      productRepositoryMock.findOneBy.mockResolvedValue(null);
      
      const result = await service.update(updatedProductInput);
      expect(productRepositoryMock.findOneBy).toHaveBeenCalledTimes(1);
      expect(productRepositoryMock.findOneBy).toHaveBeenCalledWith({ id: updatedProductInput.id });
      
      expect(productRepositoryMock.save).not.toHaveBeenCalled();

      expect(result).toStrictEqual({
        id: undefined,
        name: undefined,
        price: undefined
      });
    });
  })
  
  describe("remove product", () => {
    it('should indicate remove a product succeeded', async () => {

      productRepositoryMock.delete.mockResolvedValue({
        affected: 1
      })
      const result = await service.remove(testProductId1);
      expect(productRepositoryMock.delete).toBeCalledWith({id: testProductId1});
      expect(result).toEqual({ isDeleted: true });
    });

    it('should indicate remove a product did not succeed', async () => {

      productRepositoryMock.delete.mockResolvedValue({
        affected: 0
      })
      const result = await service.remove(testProductId1);
      expect(productRepositoryMock.delete).toBeCalledWith({id: testProductId1});
      expect(result).toEqual({ isDeleted: false });
    });
  });
});
