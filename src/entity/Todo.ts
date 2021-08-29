import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User";

@Entity({ name: 'Todos' })
@ObjectType()
export class Todo extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field(() => String)
  @Column({
    type: 'varchar',
  })
  name!: string;

  @Field(() => User)
  @ManyToOne(() => User, (owner) => owner.todos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  owner!: User;

  @Field(() => Date, {
    nullable: true,
  })
  @Column({
    type: 'timestamp with time zone',
    nullable: true,
    default: null,
  })
  completedAt!: Date;

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
