import { Context } from '../types/context';
import { AuthenticationError, ForbiddenError } from 'apollo-server-express';

export const reportResolvers = {
  Query: {
    reports: async (_: any, { type }: any, { prisma, user }: Context) => {
      if (!user) {
        throw new AuthenticationError('Authentication required');
      }

      const where: any = {};
      if (type) {
        where.title = { contains: type, mode: 'insensitive' };
      }

      // Users can only see their own reports unless they're admin
      if (user.role !== 'ADMIN') {
        where.generatedBy = user.id;
      }

      return prisma.report.findMany({
        where,
        include: { user: { include: { profile: true } } },
        orderBy: { createdAt: 'desc' },
      });
    },

    report: async (_: any, { id }: any, { prisma, user }: Context) => {
      if (!user) {
        throw new AuthenticationError('Authentication required');
      }

      const report = await prisma.report.findUnique({
        where: { id: parseInt(id) },
        include: { user: { include: { profile: true } } },
      });

      if (!report) {
        return null;
      }

      // Users can only access their own reports unless they're admin
      if (user.role !== 'ADMIN' && report.generatedBy !== user.id) {
        throw new ForbiddenError('Access denied');
      }

      return report;
    },
  },

  Mutation: {
    generateReport: async (_: any, { input }: any, { prisma, user }: Context) => {
      if (!user) {
        throw new AuthenticationError('Authentication required');
      }

      const report = await prisma.report.create({
        data: {
          title: input.title,
          generatedBy: user.id,
          status: 'PENDING',
        },
        include: { user: { include: { profile: true } } },
      });

      // Here you would typically trigger a background job to generate the actual report
      // For now, we'll just simulate it by updating the status after a delay
      setTimeout(async () => {
        await prisma.report.update({
          where: { id: report.id },
          data: {
            status: 'COMPLETED',
            filePath: `/reports/${report.id}-${input.type}-report.pdf`,
          },
        });
      }, 5000);

      return report;
    },

    deleteReport: async (_: any, { id }: any, { prisma, user }: Context) => {
      if (!user) {
        throw new AuthenticationError('Authentication required');
      }

      const report = await prisma.report.findUnique({
        where: { id: parseInt(id) },
      });

      if (!report) {
        return false;
      }

      // Users can only delete their own reports unless they're admin
      if (user.role !== 'ADMIN' && report.generatedBy !== user.id) {
        throw new ForbiddenError('Access denied');
      }

      await prisma.report.delete({
        where: { id: parseInt(id) },
      });

      return true;
    },
  },

  Report: {
    generatedBy: async (parent: any, _: any, { prisma }: Context) => {
      return prisma.user.findUnique({
        where: { id: parent.generatedBy },
        include: { profile: true },
      });
    },
  },
};
