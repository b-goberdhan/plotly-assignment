import { Field, ObjectType } from '@nestjs/graphql';
import { GraphQLFloat, GraphQLString } from 'graphql';

@ObjectType()
export class ProductDto {
  @Field(() => GraphQLString, { description: 'The id (uuid) of the product.'})
  id: string;
  
  @Field(() => GraphQLString, { description: 'The name of the product.' })
  name: string;

  @Field(() => GraphQLFloat, { description: 'The price of the product.'})
  price: number;
}
