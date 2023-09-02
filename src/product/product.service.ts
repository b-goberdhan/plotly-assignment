import { Injectable } from '@nestjs/common';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { Repository } from 'typeorm';
import { ProductDto } from './dto/product.dto';
import { ProductDeletedDto } from './dto/product-deleted.dto';
import { UserEntity } from '../user/entities/user.entity';

@Injectable()
export class ProductService {

  constructor(
    @InjectRepository(ProductEntity) private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>
    ) {}

  async create(createProductInput: CreateProductInput) : Promise<ProductDto> {
    return this.productToDto(await this.productRepository.save({...createProductInput}));
  }

  async findAll() : Promise<ProductDto[]> {
    return (await this.productRepository.find()).map(this.productToDto);
  }

  async findAllByUserId(userId: string) : Promise<ProductDto[]> {
    const productsForUser = await this.userRepository.findOne({
      relations: {
        orders: true,
      },
      where: { id: userId }
    });
    return productsForUser.orders.map(this.productToDto);
    
  }

  async findOne(id: string) : Promise<ProductDto> {
    return this.productToDto((await this.productRepository.findOneBy({id})));
  }

  async update(updateProductInput: UpdateProductInput) : Promise<ProductDto> {
    const currentProduct = await this.productRepository.findOneBy({ id: updateProductInput.id });
    if (currentProduct) {
      currentProduct.name = updateProductInput.name ?? currentProduct.name;
      currentProduct.price = updateProductInput.price ?? currentProduct.price;

      await this.productRepository.save(currentProduct);
    }
    return this.productToDto(currentProduct);
  }

  async remove(id: string) : Promise<ProductDeletedDto> {
    const deleteResult = await this.productRepository.delete({id});
    return { isDeleted: deleteResult.affected === 1 };
  }

  private productToDto(product: ProductEntity): ProductDto {
    return ({
      id: product?.id,
      name: product?.name,
      price: product?.price
    }) as ProductDto
  }
}
