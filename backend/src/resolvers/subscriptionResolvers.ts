import { PubSub, withFilter } from 'graphql-subscriptions';
import { Context } from '../types/context';

const pubsub = new PubSub();

// Event names
export const ANALYTICS_UPDATED = 'ANALYTICS_UPDATED';
export const SALES_METRIC_ADDED = 'SALES_METRIC_ADDED';
export const INVENTORY_UPDATED = 'INVENTORY_UPDATED';
export const USER_STATUS_CHANGED = 'USER_STATUS_CHANGED';
export const REPORT_STATUS_CHANGED = 'REPORT_STATUS_CHANGED';

export const subscriptionResolvers = {
  Subscription: {
    analyticsUpdated: {
      subscribe: () => pubsub.asyncIterator([ANALYTICS_UPDATED]),
    },

    salesMetricAdded: {
      subscribe: () => pubsub.asyncIterator([SALES_METRIC_ADDED]),
    },

    inventoryUpdated: {
      subscribe: () => pubsub.asyncIterator([INVENTORY_UPDATED]),
    },

    userStatusChanged: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([USER_STATUS_CHANGED]),
        (payload, variables) => {
          return payload.userStatusChanged.id === variables.userId;
        }
      ),
    },

    reportStatusChanged: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([REPORT_STATUS_CHANGED]),
        (payload, variables) => {
          return payload.reportStatusChanged.id === variables.reportId;
        }
      ),
    },
  },
};

// Helper functions to publish events
export const publishAnalyticsUpdate = (analytics: any) => {
  pubsub.publish(ANALYTICS_UPDATED, { analyticsUpdated: analytics });
};

export const publishSalesMetricAdded = (salesMetric: any) => {
  pubsub.publish(SALES_METRIC_ADDED, { salesMetricAdded: salesMetric });
};

export const publishInventoryUpdate = (inventoryItem: any) => {
  pubsub.publish(INVENTORY_UPDATED, { inventoryUpdated: inventoryItem });
};

export const publishUserStatusChange = (user: any) => {
  pubsub.publish(USER_STATUS_CHANGED, { userStatusChanged: user });
};

export const publishReportStatusChange = (report: any) => {
  pubsub.publish(REPORT_STATUS_CHANGED, { reportStatusChanged: report });
};

export { pubsub };
