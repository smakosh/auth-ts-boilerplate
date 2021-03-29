import { Field, InputType } from 'type-graphql';

@InputType()
export class RequestTokenLinkInput {
  @Field(() => String)
  email!: string;
}
