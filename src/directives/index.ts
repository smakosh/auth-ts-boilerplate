import { SchemaDirectiveVisitor } from 'apollo-server';
import { defaultFieldResolver, GraphQLField } from 'graphql';

export class LowerCaseDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field: GraphQLField<string, string>): void {
    const { resolve = defaultFieldResolver } = field;

    field.resolve = async (...args) => {
      const result = await resolve.apply(this, args);

      if (typeof result === 'string') {
        return result.toLowerCase();
      }

      return result;
    };
  }
}
