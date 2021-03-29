import argon2 from 'argon2';
import {
  Arg,
  Authorized,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from 'type-graphql';
import { getManager } from 'typeorm';
import { UserInputError } from 'apollo-server';
import { User, UserType } from '../entity/User';
import { ContextType } from '../types';
import {
  UserSignUpInput,
  UserSignInInput,
  UserGetInput,
} from '../inputs/UserInput';
import { FormError } from '../types/FormError';

@ObjectType()
export class UserResponse {
  @Field(() => [FormError], { nullable: true })
  errors?: FormError[];

  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => String, { nullable: true })
  message?: string;
}
@Resolver(User)
export class UserResolver {
  @Query(() => UserResponse, { nullable: true })
  async me(@Ctx() { req }: ContextType): Promise<UserResponse> {
    try {
      if (!req.session.userId && !req.user) {
        return {
          errors: [
            {
              field: 'user',
              message: 'User already logged out.',
            },
          ],
        };
      }

      const user = await User.findOne(req.session.userId || req.user.id);

      return {
        user,
      };
    } catch (error) {
      return {
        errors: [
          {
            field: 'exception',
            message: error.message,
          },
        ],
      };
    }
  }

  @Query(() => UserResponse, { nullable: true })
  @Authorized([UserType.ADMIN_USER])
  async getUser(@Arg('params') { id }: UserGetInput): Promise<UserResponse> {
    try {
      const user = await User.findOneOrFail({
        where: { id },
      });

      return { user };
    } catch (error) {
      return {
        errors: [
          {
            field: 'exception',
            message: error,
          },
        ],
      };
    }
  }

  @Mutation(() => UserResponse)
  async signup(
    @Arg('params')
    { email, password, username }: UserSignUpInput,
    @Ctx() { req }: ContextType,
  ): Promise<UserResponse> {
    try {
      password = await argon2.hash(password);

      const user = await getManager().transaction(async (transaction) => {
        const existingUser = await transaction.findOne(User, {
          where: [
            {
              email,
            },
            {
              username,
            },
          ],
        });

        if (existingUser?.email === email) {
          throw new UserInputError('A user with same email already exists.', {
            field: 'email',
          });
        }

        if (existingUser?.username?.toLowerCase() === username.toLowerCase()) {
          throw new UserInputError(
            'A user with same username already exists.',
            {
              field: 'username',
            },
          );
        }
        // create a new user instance
        const user = transaction.create(User, {
          username,
          email,
          password,
        });
        await transaction.save(user, {
          reload: true,
        });
        // return the created user
        return user;
      });

      req.session.userId = user.id;

      return {
        user,
      };
    } catch (error) {
      return {
        errors: [
          {
            field: error.field || 'exception',
            message: error.message,
          },
        ],
      };
    }
  }

  @Mutation(() => UserResponse)
  async signin(
    @Arg('params')
    { email, password }: UserSignInInput,
    @Ctx() { req }: ContextType,
  ): Promise<UserResponse> {
    try {
      email = email.toLocaleLowerCase();

      const user = await getManager().transaction(async (transaction) => {
        const user = await transaction.findOne(User, {
          where: {
            email,
          },
        });
        // throw an exception if no user found
        if (!user) {
          throw new UserInputError('Wrong email', {
            field: 'email',
          });
        }
        // verify the password
        await argon2.verify(user.password, password).catch(async () => {
          // hash the password
          user.password = await argon2.hash(password);
          // save
          transaction.save(user);
        });

        return user;
      });

      req.session.userId = user.id;

      return {
        user,
      };
    } catch (error) {
      return {
        errors: [
          {
            field: error.field || 'exception',
            message: error.message,
          },
        ],
      };
    }
  }

  @Mutation(() => UserResponse)
  async logout(@Ctx() { req, res }: ContextType): Promise<UserResponse> {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        if (process.env.SESSION_COOKIE_NAME) {
          res.clearCookie(process.env.SESSION_COOKIE_NAME);
        }
        if (err) {
          resolve({
            errors: [
              {
                field: 'exception',
                message: err.message,
              },
            ],
          });
        }

        resolve({
          message: 'User logged out succcessfully',
        });
      }),
    );
  }
}
