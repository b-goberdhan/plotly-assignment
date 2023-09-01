import { InputType, Int, Field } from '@nestjs/graphql';
import { GraphQLInt, GraphQLString } from 'graphql';
import { ProductDto } from 'src/products/dto/product.dto';

@InputType()
export class AddProductToUserInput {
  @Field(() => GraphQLString, { description: 'User id' })
  userId: string;
  
  @Field(() => GraphQLString, { description: 'Product id' })
  productId: string;

}
