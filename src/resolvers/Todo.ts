import { Todo } from '../entity/Todo';
import { CreateTodoInput } from '../inputs/TodoInput';
import { ContextType } from '../types';
import { FormError } from '../types/FormError';
import { Arg, Ctx, Field, Mutation, ObjectType, Resolver } from 'type-graphql';
import { getManager } from 'typeorm';

@ObjectType()
export class TodoResponse {
    @Field(() => [FormError], { nullable: true })
    errors?: FormError[];

    @Field(() => Todo, { nullable: true })
    todo?: Todo;
}

@Resolver(Todo)
export class TodoResolver {

    @Mutation(() => TodoResponse)
    async createTodo(
        @Arg('params')
        { name }: CreateTodoInput,
        @Ctx() { req }: ContextType,
    ): Promise<TodoResponse> {
        try {
            // check auth
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

            const owner = req.user

            const todo = await getManager().transaction(async (transaction) => {
                // create a new todo instance
                const todo = transaction.create(Todo, {
                    name,
                    owner
                });
                await transaction.save(todo, {
                    reload: true,
                });
                // return the created todo
                return todo;
            })

            return {
                todo,
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
        };
    }
}