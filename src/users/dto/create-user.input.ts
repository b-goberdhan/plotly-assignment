import { InputType, Int, Field } from '@nestjs/graphql';
import { GraphQLInt, GraphQLString } from 'graphql';
import { ProductDto } from 'src/products/dto/product.dto';

@InputType()
export class CreateUserInput {
  @Field(() => GraphQLString, { description: 'User name' })
  name: string;
  @Field(() => GraphQLString, { description: 'User email' })
  email: string;
  @Field(() => GraphQLInt, { description: 'User age' })
  age: number;
}
