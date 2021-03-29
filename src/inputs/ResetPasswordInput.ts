import { Field, InputType } from 'type-graphql';

@InputType()
export class ResetPasswordInput {
  @Field(() => String)
  token!: string;

  @Field(() => String)
  password!: string;
}
