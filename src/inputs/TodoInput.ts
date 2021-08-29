import { MinLength, MaxLength } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class CreateTodoInput {
    @Field()
    @MinLength(1)
    @MaxLength(100)
    name!: string;
}
