import { Test, TestingModule } from '@nestjs/testing';
import { ProductsResolver } from './products.resolver';
import { ProductsService } from './products.service';
import { ProductDto } from './dto/product.dto';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { ProductDeletedDto } from './dto/product-deleted.dto';

describe('ProductsResolver', () => {
  let resolver: ProductsResolver;
  const productServiceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn()
  }
  beforeEach(async () => {
    jest.resetAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsResolver, 
        {
          provide: ProductsService,
          useValue: productServiceMock
        }
      ],
    }).compile();

    resolver = module.get<ProductsResolver>(ProductsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('queries', () => {
    
    it("should find all products", async () => {
      const productDtos: ProductDto[] = [
        {
          id: "product-id",
          name: "cool thing",
          price: 1.33
        },
        {
          id: "product-id-2",
          name: "cool thing 2",
          price: 4000.20
        }
      ];
      productServiceMock.findAll.mockResolvedValue(productDtos);

      const result = await resolver.findAll();
      expect(result).toEqual([
        ...productDtos
      ]);
      expect(productServiceMock.findAll).toHaveBeenCalled();
      expect(productServiceMock.findAll).toHaveBeenCalledWith();
    });

    it("should find one product", async () => {
      const productId = 'product-id';

      const productDto: ProductDto = {
          id: productId,
          name: "cool thing",
          price: 1.33
      };
      productServiceMock.findOne.mockResolvedValue(productDto);

      const result = await resolver.findOne(productId);
      expect(result).toEqual(productDto);
      expect(productServiceMock.findOne).toHaveBeenCalled();
      expect(productServiceMock.findOne).toHaveBeenCalledWith(productId);
    });
  });

  describe('mutations', () => {
    it('can create a product', async () => {
      
      const createProductInput: CreateProductInput = {
        name: "new product",
        price: 1.00,
      }
      
      const createdProductDto: ProductDto = {
        id: "neat-id",
        ...createProductInput,
      }

      productServiceMock.create.mockResolvedValue(createdProductDto);
      const result = await resolver.createProduct(createProductInput);

      expect(productServiceMock.create).toHaveBeenCalledWith(createProductInput);
      expect(result).toEqual(createdProductDto);
    });

    it('can update a product', async () => {
      const updateProductInput: UpdateProductInput = {
        id: "some-id",
        name: "new product",
        price: 1.00,
      }
      
      const product: ProductDto = {
        id: "some-id",
        name: updateProductInput.name,
        price: updateProductInput.price
      } 
     
      productServiceMock.update.mockResolvedValue(product);
      const result = await resolver.updateProduct(updateProductInput);

      expect(productServiceMock.update).toHaveBeenCalledWith(updateProductInput);
      expect(result).toEqual(product);

    });

    it('can remove a product', async () => {
      const productId = "product-to-delete";
      const productDeletedDto: ProductDeletedDto = {
        isDeleted: true,
      }

      productServiceMock.remove.mockResolvedValue(productDeletedDto);

      const result = await resolver.removeProduct(productId);;

      expect(productServiceMock.remove).toHaveBeenLastCalledWith(productId);
      expect(result).toEqual(productDeletedDto);
    });
  });
  
});
