import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { User } from './User';

@Entity({ name: 'ResetPasswordRequests' })
@ObjectType()
export class ResetPasswordRequest extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, (user) => user.tokens, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user!: User;

  @Field(() => String)
  @Column({
    type: 'varchar',
  })
  token!: string;

  @Field(() => Date)
  @CreateDateColumn({
    type: 'timestamp with time zone',
    default: false,
  })
  expiresAt?: Date;

  @Field(() => Boolean)
  @Column({
    type: 'boolean',
    default: false,
  })
  expired?: boolean;

  @Field(() => Boolean)
  @Column({
    type: 'boolean',
    default: false,
  })
  consumed?: boolean;

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
