import { Directive, Field, ID, InputType } from 'type-graphql';
import { GraphQLEmail } from 'graphql-custom-types';
import { MaxLength, MinLength } from 'class-validator';
import { UserType } from '../entity/User';

@InputType()
export class UserSignInInput {
  @Directive('@lowerCase')
  @Field(() => GraphQLEmail)
  email!: string;

  @Field()
  @MaxLength(50)
  @MinLength(6)
  password!: string;
}

@InputType()
export class UserSignUpInput {
  @Directive('@lowerCase')
  @Field(() => GraphQLEmail)
  email!: string;

  @Directive('@lowerCase')
  @Field()
  @MinLength(2)
  @MaxLength(20)
  username!: string;

  @Field()
  @MinLength(6)
  @MaxLength(50)
  password!: string;

  @Field(() => String, {
    nullable: true,
  })
  firstName!: string;

  @Field(() => String, {
    nullable: true,
  })
  lastName!: string;
}

@InputType()
export class UserUpdateInput {
  @Field(() => ID)
  id!: string;

  @Field(() => UserType)
  userType?: UserType;

  @Directive('@lowerCase')
  @Field(() => String)
  username?: string;
}

@InputType()
export class UserAvailabilityInput {
  @Directive('@lowerCase')
  @Field(() => String)
  username!: string;
}

@InputType()
export class UserGetInput {
  @Field(() => ID)
  id!: string;
}
