import { GraphQLString } from 'graphql';
import { CreateUserInput } from './create-user.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field(() => GraphQLString, {description: 'Id of the user who is being updated'})
  id: string;

  
}
