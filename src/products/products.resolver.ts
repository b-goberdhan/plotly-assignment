import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ProductsService } from './products.service';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { ProductDto } from './dto/product.dto';
import { GraphQLString } from 'graphql';
import { ProductDeletedDto } from './dto/product-deleted.dto';

@Resolver(() => ProductDto)
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @Mutation(() => ProductDto)
  async createProduct(@Args('createProductInput') createProductInput: CreateProductInput) : Promise<ProductDto> {
    return this.productsService.create(createProductInput);
  }

  @Query(() => [ProductDto], { name: 'products' })
  async findAll() : Promise<ProductDto[]> {
    return this.productsService.findAll();
  }

  @Query(() => ProductDto, { name: 'product' })
  findOne(@Args('id', { type: () => GraphQLString }) id: string) : Promise<ProductDto> {
    return this.productsService.findOne(id);
  }

  @Mutation(() => ProductDto)
  async updateProduct(@Args('updateProductInput') updateProductInput: UpdateProductInput) : Promise<ProductDto> {
    return await this.productsService.update(updateProductInput.id, updateProductInput);
  }

  @Mutation(() => ProductDto)
  removeProduct(@Args('id', { type: () => GraphQLString }) id: string) : Promise<ProductDeletedDto> {
    return this.productsService.remove(id);
  }
}
