import { Context } from '../types/context';
import { hashPassword, comparePassword, generateToken } from '../utils/auth';
import { AuthenticationError, ForbiddenError, UserInputError } from 'apollo-server-express';

export const userResolvers = {
  Query: {
    users: async (_: any, { filter, pagination }: any, { prisma, user }: Context) => {
      if (!user || user.role !== 'ADMIN') {
        throw new ForbiddenError('Access denied');
      }

      const { page = 1, limit = 10 } = pagination || {};
      const skip = (page - 1) * limit;

      const where: any = {};
      if (filter) {
        if (filter.role) where.role = filter.role;
        if (filter.email) where.email = { contains: filter.email, mode: 'insensitive' };
        if (filter.createdAfter) where.createdAt = { gte: filter.createdAfter };
        if (filter.createdBefore) where.createdAt = { ...where.createdAt, lte: filter.createdBefore };
      }

      const [users, totalCount] = await Promise.all([
        prisma.user.findMany({
          where,
          skip,
          take: limit,
          include: { profile: true },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.user.count({ where }),
      ]);

      return {
        nodes: users,
        totalCount,
        hasNextPage: skip + limit < totalCount,
        hasPreviousPage: page > 1,
      };
    },

    user: async (_: any, { id }: any, { prisma, user }: Context) => {
      if (!user) {
        throw new AuthenticationError('Authentication required');
      }

      return prisma.user.findUnique({
        where: { id: parseInt(id) },
        include: { profile: true },
      });
    },

    me: async (_: any, __: any, { prisma, user }: Context) => {
      if (!user) {
        throw new AuthenticationError('Authentication required');
      }

      return prisma.user.findUnique({
        where: { id: user.id },
        include: { profile: true },
      });
    },
  },

  Mutation: {
    login: async (_: any, { email, password }: any, { prisma }: Context) => {
      const user = await prisma.user.findUnique({
        where: { email },
        include: { profile: true },
      });

      if (!user) {
        throw new AuthenticationError('Invalid credentials');
      }

      const isValid = await comparePassword(password, user.passwordHash);
      if (!isValid) {
        throw new AuthenticationError('Invalid credentials');
      }

      const token = generateToken(user);

      return {
        token,
        user,
      };
    },

    register: async (_: any, { input }: any, { prisma }: Context) => {
      const existingUser = await prisma.user.findUnique({
        where: { email: input.email },
      });

      if (existingUser) {
        throw new UserInputError('User with this email already exists');
      }

      const passwordHash = await hashPassword(input.password);

      const user = await prisma.user.create({
        data: {
          email: input.email,
          passwordHash,
          role: input.role || 'USER',
          profile: input.profile ? {
            create: input.profile,
          } : undefined,
        },
        include: { profile: true },
      });

      const token = generateToken(user);

      return {
        token,
        user,
      };
    },

    createUser: async (_: any, { input }: any, { prisma, user }: Context) => {
      if (!user || user.role !== 'ADMIN') {
        throw new ForbiddenError('Access denied');
      }

      const existingUser = await prisma.user.findUnique({
        where: { email: input.email },
      });

      if (existingUser) {
        throw new UserInputError('User with this email already exists');
      }

      const passwordHash = await hashPassword(input.password);

      return prisma.user.create({
        data: {
          email: input.email,
          passwordHash,
          role: input.role || 'USER',
          profile: input.profile ? {
            create: input.profile,
          } : undefined,
        },
        include: { profile: true },
      });
    },

    updateUser: async (_: any, { id, input }: any, { prisma, user }: Context) => {
      if (!user || (user.role !== 'ADMIN' && user.id !== parseInt(id))) {
        throw new ForbiddenError('Access denied');
      }

      const updateData: any = {};
      if (input.email) updateData.email = input.email;
      if (input.password) updateData.passwordHash = await hashPassword(input.password);
      if (input.role && user.role === 'ADMIN') updateData.role = input.role;

      return prisma.user.update({
        where: { id: parseInt(id) },
        data: {
          ...updateData,
          profile: input.profile ? {
            upsert: {
              create: input.profile,
              update: input.profile,
            },
          } : undefined,
        },
        include: { profile: true },
      });
    },

    deleteUser: async (_: any, { id }: any, { prisma, user }: Context) => {
      if (!user || user.role !== 'ADMIN') {
        throw new ForbiddenError('Access denied');
      }

      await prisma.user.delete({
        where: { id: parseInt(id) },
      });

      return true;
    },
  },

  User: {
    profile: async (parent: any, _: any, { prisma }: Context) => {
      return prisma.userProfile.findUnique({
        where: { userId: parent.id },
      });
    },
  },
};
