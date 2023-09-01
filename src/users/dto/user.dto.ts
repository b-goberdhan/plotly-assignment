import { ObjectType, Field, } from '@nestjs/graphql';
import { GraphQLInt, GraphQLString } from 'graphql';
import { ProductDto } from 'src/products/dto/product.dto';

@ObjectType()
export class UserDto {
  @Field(() => GraphQLString, { description: 'User Id (guid)' })
  id: string;

  @Field(() => GraphQLString, { description: 'User name', nullable: true })
  name?: string;

  @Field(() => GraphQLString, { description: 'User email', nullable: true })
  email?: string; //todo validate email regex

  @Field(() => GraphQLInt, { description: 'User age', nullable: true })
  age?: number;
  
  @Field(() => ProductDto)
  orders?: ProductDto[]
}
