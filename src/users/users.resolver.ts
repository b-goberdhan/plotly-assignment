import { Resolver, Query, Mutation, Args, } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { GraphQLString } from 'graphql';
import { UserDto } from './dto/user.dto';
import { UserDeletedDto } from './dto/user-deleted.dto';
import { ProductsService } from 'src/products/products.service';
import { AddProductToUserInput } from './dto/add-product-to-user.input';

@Resolver(() => UserDto)
export class UsersResolver {

  constructor(
    private readonly usersService: UsersService, 
  ) {}

  @Mutation(() => UserDto)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput): Promise<UserDto> {
    return this.usersService.create(createUserInput);
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
  async addProduct(@Args('addProductToUserInput', { type: () => AddProductToUserInput}) addProductToUserInput : AddProductToUserInput) : Promise<UserDto> {
    return await this.usersService.addProductToUser(addProductToUserInput.userId, addProductToUserInput.productId);
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
