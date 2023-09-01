import { ObjectType, Field, } from '@nestjs/graphql';
import { GraphQLBoolean } from 'graphql';

@ObjectType()
export class UserDeletedDto {
  @Field(() => GraphQLBoolean, { description: 'Was user deleted' })
  isDeleted: boolean;
}