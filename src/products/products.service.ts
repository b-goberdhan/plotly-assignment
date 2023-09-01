import { Injectable } from '@nestjs/common';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { ProductDto } from './dto/product.dto';
import { ProductDeletedDto } from './dto/product-deleted.dto';

@Injectable()
export class ProductsService {

  constructor(@InjectRepository(Product) private productRepository: Repository<Product>) {}

  async create(createProductInput: CreateProductInput) : Promise<ProductDto> {
    return (await this.productRepository.save({...createProductInput})) as ProductDto;
  }

  async findAll() : Promise<ProductDto[]> {
    return (await this.productRepository.find()).map(product => product as ProductDto);
  }

  async findOne(id: string) : Promise<ProductDto> {
    return (await this.productRepository.findOneBy({id})) as ProductDto;
  }

  async update(id: string, updateProductInput: UpdateProductInput) : Promise<ProductDto> {
    const currentProduct = await this.productRepository.findOneBy({ id });
    if (currentProduct) {
      currentProduct.name = updateProductInput.name;
      currentProduct.price = updateProductInput.price;

      await this.productRepository.save(currentProduct);
    }
    return currentProduct as ProductDto;
  }

  async remove(id: string) : Promise<ProductDeletedDto> {
    const deleteResult = await this.productRepository.delete({id});
    return { isDeleted: deleteResult.affected === 1 };
  }
}
