import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class FormError {
  @Field(() => String)
  field?: string;

  @Field(() => String)
  message?: string;
}
