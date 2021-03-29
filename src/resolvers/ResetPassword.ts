import argon2 from 'argon2';
import crypto from 'crypto';
import dayjs from 'dayjs';
import { getRepository } from 'typeorm';
import {
  Arg,
  Authorized,
  Field,
  Mutation,
  ObjectType,
  Resolver,
} from 'type-graphql';
import { RequestTokenLinkInput } from '../inputs/RequestTokenLinkInput';
import { User, UserType } from '../entity/User';
import { Emailing } from '../services/Emailing';
import { ResetPasswordRequest } from '../entity/ResetPasswordRequest';
import { ResetPasswordInput } from '../inputs/ResetPasswordInput';
import { FormError } from '../types/FormError';

@ObjectType()
export class ResetPasswordResponse {
  @Field(() => String, { nullable: true })
  token?: string;

  @Field(() => [FormError], { nullable: true })
  errors?: FormError[];
}

@Resolver(ResetPasswordRequest)
export class ResetPasswordRequestResolver {
  @Mutation(() => ResetPasswordResponse)
  @Authorized([UserType.NORMAL_USER, UserType.ADMIN_USER])
  async requestResetToken(
    @Arg('params') params: RequestTokenLinkInput,
  ): Promise<ResetPasswordResponse> {
    try {
      // find a user with that email
      const user = await User.findOne({
        where: {
          email: params.email,
        },
        relations: ['profile'],
      });
      // if no user then throw error
      if (!user) {
        throw new Error('The email was not found.');
      }
      // else, generate a token link
      const ResetPasswordRequestModel = new ResetPasswordRequest();
      // generate a token time based
      const token = crypto
        .createHmac('sha256', 'secret')
        .update(String(Date.now()))
        .digest('hex');
      // create the model properties
      ResetPasswordRequestModel.token = token;
      ResetPasswordRequestModel.expiresAt = dayjs().add(1, 'day').toDate();
      ResetPasswordRequestModel.user = user;
      ResetPasswordRequestModel.expired = false;
      ResetPasswordRequestModel.consumed = false;
      // save the model entity
      ResetPasswordRequestModel.save();
      // init the mailer
      const mailer = new Emailing(
        user.email,
        String(process.env.SENDGRID_SENDER_EMAIL),
      );
      // send the reset email
      mailer.resetPasswordRequest(
        String(user?.username),
        `${process.env.SCHEME}://${process.env.APP_URL}${process.env.APP_RESET_PASSWORD_PATH}/${token}`,
      );

      return {
        token: 'done',
      };
    } catch (error) {
      return {
        errors: [
          {
            field: 'email',
            message: error.message,
          },
        ],
      };
    }
  }

  @Mutation(() => ResetPasswordResponse)
  @Authorized([UserType.NORMAL_USER, UserType.ADMIN_USER])
  async resetPassword(
    @Arg('params') { token, password }: ResetPasswordInput,
  ): Promise<ResetPasswordResponse> {
    try {
      // find the token and extract the user
      const tokenModel = await getRepository(ResetPasswordRequest).findOne({
        where: {
          token,
          consumed: false,
          expired: false,
        },
        relations: ['user'],
      });
      // check if not empty || user not found
      if (!tokenModel || !tokenModel?.user?.id) {
        throw Error('Invalid token.');
      }
      // check that the password is not empty
      if (!password.length) {
        return {
          errors: [
            {
              field: 'password',
              message: 'Password is invalid.',
            },
          ],
        };
      }
      // set token consumed to true
      tokenModel.consumed = true;
      // reset the password
      tokenModel.user.password = await argon2.hash(password);
      // save the token model
      tokenModel.save();
      tokenModel.user.save();
      // return the token
      return {
        token,
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
}
