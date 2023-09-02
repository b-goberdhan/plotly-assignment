import { ObjectType, Field, } from '@nestjs/graphql';
import { GraphQLBoolean } from 'graphql';

@ObjectType()
export class ProductDeletedDto {
  @Field(() => GraphQLBoolean, { description: 'Was user deleted' })
  isDeleted: boolean;
}