import { Field, ID, ObjectType, registerEnumType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ResetPasswordRequest } from './ResetPasswordRequest';

export enum UserType {
  ADMIN_USER = 'ADMIN',
  BETA_USER = 'BETA',
  NORMAL_USER = 'NORMAL',
}

registerEnumType(UserType, {
  name: 'UserType',
});

@Entity({ name: 'Users' })
@ObjectType()
@Index(['email'], { unique: true })
@Index(['username'], { unique: true })
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field(() => String)
  @Column({
    type: 'varchar',
  })
  email!: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  password!: string;

  @Field(() => String, {
    nullable: true,
  })
  @Column({
    type: 'varchar',
    nullable: true,
    unique: true,
  })
  username?: string;

  @Field(() => UserType)
  @Column({
    type: 'enum',
    enum: UserType,
    default: UserType.NORMAL_USER,
  })
  userType?: string;

  @Field(() => Date, {
    nullable: true,
  })
  @Column({
    type: 'timestamp',
    nullable: true,
  })
  emailVerifiedAt?: Date;

  @Field(() => String, {
    nullable: true,
  })
  @Column({
    type: 'varchar',
    nullable: true,
    unique: true,
  })
  refreshToken?: string;

  @Field(() => String, {
    nullable: true,
  })
  @Column({
    type: 'varchar',
    nullable: true,
    unique: true,
  })
  accessToken?: string;

  @OneToMany(() => ResetPasswordRequest, (token) => token.user, {
    cascade: true,
  })
  @Field(() => [ResetPasswordRequest], {
    nullable: true,
  })
  tokens?: ResetPasswordRequest[];

  @Field(() => Date)
  @CreateDateColumn({
    type: 'timestamp with time zone',
  })
  createdAt!: Date;

  @Field(() => Date, {
    nullable: true,
  })
  @UpdateDateColumn({
    type: 'timestamp with time zone',
    nullable: true,
    default: null,
  })
  updatedAt!: Date;

  @Field(() => Date, {
    nullable: true,
  })
  @DeleteDateColumn({
    type: 'timestamp with time zone',
    nullable: true,
    default: null,
  })
  deletedAt!: Date;
}
