import { InputType, Field, ObjectType } from '@nestjs/graphql';
import { GraphQLFloat, GraphQLString } from 'graphql';

@ObjectType()
export class ProductDto {
  @Field(() => GraphQLString, { description: 'Example field (placeholder)', nullable: true })
  id: string;
  
  @Field(() => GraphQLString, { description: 'Example field (placeholder)', nullable: true })
  name: string;

  @Field(() => GraphQLFloat, { nullable: true})
  price: number;
}
