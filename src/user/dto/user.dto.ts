import { ObjectType, Field, } from '@nestjs/graphql';
import { GraphQLInt, GraphQLString } from 'graphql';
import { ProductDto } from '../../product/dto/product.dto';

@ObjectType()
export class UserDto {
  @Field(() => GraphQLString, { description: 'User Id (uuid)' })
  id: string;

  @Field(() => GraphQLString, { description: 'User name' })
  name: string;

  @Field(() => GraphQLString, { description: 'User email' })
  email: string;

  @Field(() => GraphQLInt, { description: 'User age' })
  age: number;
  
  @Field(() => [ProductDto], { description: 'Products that the user ordered' })
  orders: ProductDto[]
}
