import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { ProductDto } from './dto/product.dto';
import { GraphQLString } from 'graphql';
import { ProductDeletedDto } from './dto/product-deleted.dto';

@Resolver(() => ProductDto)
export class ProductResolver {
  constructor(private readonly productsService: ProductService) {}

  @Query(() => [ProductDto], { name: 'products' })
  async findAll() : Promise<ProductDto[]> {
    return this.productsService.findAll();
  }

  @Query(() => ProductDto, { name: 'product' })
  findOne(@Args('id', { type: () => GraphQLString }) id: string) : Promise<ProductDto> {
    return this.productsService.findOne(id);
  }

  @Mutation(() => ProductDto)
  async createProduct(@Args('createProductInput') createProductInput: CreateProductInput) : Promise<ProductDto> {
    return this.productsService.create(createProductInput);
  }

  @Mutation(() => ProductDto)
  async updateProduct(@Args('updateProductInput') updateProductInput: UpdateProductInput) : Promise<ProductDto> {
    return await this.productsService.update(updateProductInput);
  }

  @Mutation(() => ProductDeletedDto)
  removeProduct(@Args('id', { type: () => GraphQLString }) id: string) : Promise<ProductDeletedDto> {
    return this.productsService.remove(id);
  }
}
