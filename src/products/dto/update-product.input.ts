import { GraphQLFloat, GraphQLString } from 'graphql';
import { CreateProductInput } from './create-product.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateProductInput extends PartialType(CreateProductInput) {
  @Field(() => GraphQLString)
  id: string;
}
