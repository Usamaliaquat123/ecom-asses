import { Context } from '../types/context';
import { AuthenticationError } from 'apollo-server-express';

export const analyticsResolvers = {
  Query: {
    analytics: async (_: any, { dateRange }: any, { prisma, user }: Context) => {
      if (!user) {
        throw new AuthenticationError('Authentication required');
      }

      const { startDate, endDate } = dateRange;

      // Get sales data
      const salesData = await prisma.salesMetric.findMany({
        where: {
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
        orderBy: { date: 'asc' },
      });

      // Get customer metrics
      const customerMetrics = await prisma.customerMetric.findMany({
        where: {
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
        orderBy: { date: 'desc' },
        take: 1,
      });

      // Get inventory status
      const inventoryStatus = await prisma.inventoryItem.findMany({
        orderBy: { lastUpdated: 'desc' },
      });

      // Calculate totals
      const totalRevenue = salesData.reduce((sum, metric) => sum + Number(metric.revenue), 0);
      const totalOrders = salesData.reduce((sum, metric) => sum + metric.orders, 0);
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      const latestCustomerMetrics = customerMetrics[0] || {
        totalCustomers: 0,
        newCustomers: 0,
        returningCustomers: 0,
        averageOrderValue: 0,
      };

      // Calculate growth rate (simplified)
      const growthRate = customerMetrics.length > 1 ? 
        ((customerMetrics[0].totalCustomers - customerMetrics[1].totalCustomers) / customerMetrics[1].totalCustomers) * 100 : 0;

      return {
        salesData,
        customerMetrics: {
          ...latestCustomerMetrics,
          growthRate,
        },
        inventoryStatus,
        totalRevenue,
        totalOrders,
        averageOrderValue,
      };
    },

    salesMetrics: async (_: any, { dateRange, channel }: any, { prisma, user }: Context) => {
      if (!user) {
        throw new AuthenticationError('Authentication required');
      }

      const where: any = {
        date: {
          gte: dateRange.startDate,
          lte: dateRange.endDate,
        },
      };

      if (channel) {
        where.channel = channel;
      }

      return prisma.salesMetric.findMany({
        where,
        orderBy: { date: 'asc' },
      });
    },

    customerMetrics: async (_: any, { dateRange }: any, { prisma, user }: Context) => {
      if (!user) {
        throw new AuthenticationError('Authentication required');
      }

      const metrics = await prisma.customerMetric.findMany({
        where: {
          date: {
            gte: dateRange.startDate,
            lte: dateRange.endDate,
          },
        },
        orderBy: { date: 'desc' },
        take: 2,
      });

      const latest = metrics[0] || {
        totalCustomers: 0,
        newCustomers: 0,
        returningCustomers: 0,
        averageOrderValue: 0,
      };

      const growthRate = metrics.length > 1 ? 
        ((metrics[0].totalCustomers - metrics[1].totalCustomers) / metrics[1].totalCustomers) * 100 : 0;

      return {
        ...latest,
        growthRate,
      };
    },

    inventoryItems: async (_: any, { category, lowStock }: any, { prisma, user }: Context) => {
      if (!user) {
        throw new AuthenticationError('Authentication required');
      }

      const where: any = {};
      
      if (category) {
        where.category = category;
      }

      if (lowStock) {
        where.stock = { lt: 10 }; // Consider items with less than 10 as low stock
      }

      return prisma.inventoryItem.findMany({
        where,
        orderBy: { lastUpdated: 'desc' },
      });
    },
  },

  Mutation: {
    updateAnalytics: async (_: any, { input }: any, { prisma, user }: Context) => {
      if (!user) {
        throw new AuthenticationError('Authentication required');
      }

      // Create analytics data entry
      await prisma.analyticsData.create({
        data: {
          userId: user.id,
          metricType: input.metricType,
          value: input.value,
          metadata: input.metadata ? JSON.parse(input.metadata) : null,
        },
      });

      // Return updated analytics (simplified - you might want to implement proper caching)
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      return analyticsResolvers.Query.analytics(
        _,
        { dateRange: { startDate: startOfMonth, endDate: now } },
        { prisma, user } as Context
      );
    },

    addSalesMetric: async (_: any, { input }: any, { prisma, user }: Context) => {
      if (!user || (user.role !== 'ADMIN' && user.role !== 'MANAGER')) {
        throw new AuthenticationError('Insufficient permissions');
      }

      return prisma.salesMetric.create({
        data: input,
      });
    },

    updateInventoryItem: async (_: any, { id, input }: any, { prisma, user }: Context) => {
      if (!user || (user.role !== 'ADMIN' && user.role !== 'MANAGER')) {
        throw new AuthenticationError('Insufficient permissions');
      }

      return prisma.inventoryItem.update({
        where: { id: parseInt(id) },
        data: {
          ...input,
          lastUpdated: new Date(),
        },
      });
    },
  },
};
