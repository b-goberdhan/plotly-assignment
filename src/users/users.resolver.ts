import { Resolver, Query, Mutation, Args, ResolveField, Parent, } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { GraphQLString } from 'graphql';
import { UserDto } from './dto/user.dto';
import { UserDeletedDto } from './dto/user-deleted.dto';
import { ProductsService } from 'src/products/products.service';
import { ProductDto } from 'src/products/dto/product.dto';

@Resolver(() => UserDto)
export class UsersResolver {

  constructor(
    private readonly usersService: UsersService, 
    private readonly productService: ProductsService
  ) {}

  @ResolveField(() => [ProductDto])
  async orders(@Parent() user: UserDto) {
    return await this.productService.findAllByUserId(user.id);
  }

  @Query(() => [UserDto], { name: 'users' })
  async findAll() {
    return await this.usersService.findAll()
  }

  @Query(() => UserDto, { name: 'user', })
  async findOne(@Args('id', { type: () => GraphQLString }) id: string) : Promise<UserDto> {
    return await this.usersService.findOne(id);
  }

  @Mutation(() => UserDto)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput): Promise<UserDto> {
    return await this.usersService.create(createUserInput);
  }

  @Mutation(() => UserDto)
  async updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput, 
    ) : Promise<UserDto> {
    return await this.usersService.update(updateUserInput.id, updateUserInput);
  }

  @Mutation(() => UserDto)
  async removeUser(@Args('id', { type: () => GraphQLString }) id: string): Promise<UserDeletedDto> {
    return this.usersService.remove(id);
  }
}
