import { InputType, Int, Field } from '@nestjs/graphql';
import { GraphQLFloat, GraphQLString } from 'graphql';

@InputType()
export class CreateProductInput {
  @Field(() => GraphQLString, { description: 'Example field (placeholder)' })
  name: string;

  @Field(() => GraphQLFloat)
  price: number;
}
