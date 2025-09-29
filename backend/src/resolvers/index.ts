import { userResolvers } from './userResolvers';
import { analyticsResolvers } from './analyticsResolvers';
import { reportResolvers } from './reportResolvers';
import { subscriptionResolvers } from './subscriptionResolvers';
import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';

// Custom scalar types
const DateTimeScalar = new GraphQLScalarType({
  name: 'DateTime',
  description: 'Date custom scalar type',
  serialize(value: any) {
    return value instanceof Date ? value.toISOString() : value;
  },
  parseValue(value: any) {
    return new Date(value);
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  },
});

const DecimalScalar = new GraphQLScalarType({
  name: 'Decimal',
  description: 'Decimal custom scalar type',
  serialize(value: any) {
    return parseFloat(value);
  },
  parseValue(value: any) {
    return parseFloat(value);
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.FLOAT || ast.kind === Kind.INT) {
      return parseFloat(ast.value);
    }
    return null;
  },
});

export const resolvers = {
  DateTime: DateTimeScalar,
  Decimal: DecimalScalar,
  
  Query: {
    ...userResolvers.Query,
    ...analyticsResolvers.Query,
    ...reportResolvers.Query,
  },
  
  Mutation: {
    ...userResolvers.Mutation,
    ...analyticsResolvers.Mutation,
    ...reportResolvers.Mutation,
  },
  
  Subscription: {
    ...subscriptionResolvers.Subscription,
  },
  
  User: {
    ...userResolvers.User,
  },
  
  Report: {
    ...reportResolvers.Report,
  },
};
