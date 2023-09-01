import { ObjectType, Field, } from '@nestjs/graphql';
import { GraphQLBoolean } from 'graphql';

@ObjectType()
export class UserDeletedDto {
  @Field(() => GraphQLBoolean, { description: 'Details if the given user was  deleted' })
  isDeleted: boolean;
}