import { gql } from '@apollo/client';

export const ANALYTICS_UPDATED = gql`
  subscription AnalyticsUpdated {
    analyticsUpdated {
      salesData {
        id
        date
        revenue
        orders
        customers
        channel
        createdAt
      }
      customerMetrics {
        totalCustomers
        newCustomers
        returningCustomers
        averageOrderValue
        growthRate
      }
      inventoryStatus {
        id
        sku
        name
        category
        stock
        reserved
        price
        cost
        supplier
        lastUpdated
        createdAt
      }
      totalRevenue
      totalOrders
      averageOrderValue
    }
  }
`;

export const SALES_METRIC_ADDED = gql`
  subscription SalesMetricAdded {
    salesMetricAdded {
      id
      date
      revenue
      orders
      customers
      channel
      createdAt
    }
  }
`;

export const INVENTORY_UPDATED = gql`
  subscription InventoryUpdated {
    inventoryUpdated {
      id
      sku
      name
      category
      stock
      reserved
      price
      cost
      supplier
      lastUpdated
      createdAt
    }
  }
`;

export const USER_STATUS_CHANGED = gql`
  subscription UserStatusChanged($userId: ID!) {
    userStatusChanged(userId: $userId) {
      id
      email
      role
      profile {
        firstName
        lastName
        avatar
        phone
      }
      createdAt
      updatedAt
    }
  }
`;

export const REPORT_STATUS_CHANGED = gql`
  subscription ReportStatusChanged($reportId: ID!) {
    reportStatusChanged(reportId: $reportId) {
      id
      title
      generatedBy {
        id
        email
        profile {
          firstName
          lastName
        }
      }
      filePath
      status
      createdAt
      updatedAt
    }
  }
`;
