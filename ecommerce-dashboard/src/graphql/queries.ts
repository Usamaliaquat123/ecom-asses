import { gql } from '@apollo/client';

export const GET_ANALYTICS = gql`
  query GetAnalytics($dateRange: DateRange!) {
    analytics(dateRange: $dateRange) {
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

export const GET_SALES_METRICS = gql`
  query GetSalesMetrics($dateRange: DateRange!, $channel: String) {
    salesMetrics(dateRange: $dateRange, channel: $channel) {
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

export const GET_CUSTOMER_METRICS = gql`
  query GetCustomerMetrics($dateRange: DateRange!) {
    customerMetrics(dateRange: $dateRange) {
      totalCustomers
      newCustomers
      returningCustomers
      averageOrderValue
      growthRate
    }
  }
`;

export const GET_INVENTORY_ITEMS = gql`
  query GetInventoryItems($category: String, $lowStock: Boolean) {
    inventoryItems(category: $category, lowStock: $lowStock) {
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

export const GET_REPORTS = gql`
  query GetReports($type: String) {
    reports(type: $type) {
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

export const GET_USERS = gql`
  query GetUsers($filter: UserFilter, $pagination: Pagination) {
    users(filter: $filter, pagination: $pagination) {
      nodes {
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
      totalCount
      hasNextPage
      hasPreviousPage
    }
  }
`;

export const GET_ME = gql`
  query GetMe {
    me {
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
