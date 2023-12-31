import { Resolver, Query, Mutation, Args, ResolveField, Parent, } from '@nestjs/graphql';
import { UserService } from './user.service';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { GraphQLString } from 'graphql';
import { UserDto } from './dto/user.dto';
import { UserDeletedDto } from './dto/user-deleted.dto';
import { ProductDto } from '../product/dto/product.dto';
import { ProductService } from '../product/product.service';

@Resolver(() => UserDto)
export class UserResolver {

  constructor(
    private readonly usersService: UserService,
    private readonly productService: ProductService 
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
    return await this.usersService.update(updateUserInput);
  }

  @Mutation(() => UserDeletedDto)
  async removeUser(@Args('id', { type: () => GraphQLString }) id: string): Promise<UserDeletedDto> {
    return this.usersService.remove(id);
  }
}
