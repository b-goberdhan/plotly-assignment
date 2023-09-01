import { InputType, Field, ObjectType } from '@nestjs/graphql';
import { GraphQLFloat, GraphQLString } from 'graphql';

@ObjectType()
export class ProductDto {
  @Field(() => GraphQLString, { description: 'Example field (placeholder)' })
  id: string;
  
  @Field(() => GraphQLString, { description: 'Example field (placeholder)' })
  name: string;

  @Field(() => GraphQLFloat)
  price: number;
}
