import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  scalar DateTime
  scalar Decimal

  enum UserRole {
    ADMIN
    USER
    MODERATOR
  }

  enum ReportStatus {
    PENDING
    PROCESSING
    COMPLETED
    FAILED
  }

  enum ReportType {
    SALES
    USERS
    ANALYTICS
    INVENTORY
  }

  # Core User Types
  type User {
    id: ID!
    email: String!
    role: UserRole!
    profile: UserProfile
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type UserProfile {
    id: ID!
    firstName: String
    lastName: String
    avatar: String
    phone: String
    address: String
    isActive: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  # Analytics Types
  type SalesMetric {
    id: ID!
    date: DateTime!
    revenue: Decimal!
    orders: Int!
    customers: Int!
    channel: String!
    createdAt: DateTime!
  }

  type CustomerMetrics {
    totalCustomers: Int!
    newCustomers: Int!
    returningCustomers: Int!
    averageOrderValue: Decimal!
    growthRate: Float!
  }

  type InventoryItem {
    id: ID!
    sku: String!
    name: String!
    category: String!
    stock: Int!
    reserved: Int!
    price: Decimal!
    cost: Decimal!
    supplier: String
    lastUpdated: DateTime!
    createdAt: DateTime!
  }

  # Required Analytics Type
  type Analytics {
    salesData: [SalesMetric!]!
    customerMetrics: CustomerMetrics!
    inventoryStatus: [InventoryItem!]!
    totalRevenue: Decimal!
    totalOrders: Int!
    averageOrderValue: Decimal!
  }

  # Report Types
  type Report {
    id: ID!
    title: String!
    type: ReportType!
    generatedBy: User!
    filePath: String
    status: ReportStatus!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  # Input Types
  input UserFilter {
    role: UserRole
    email: String
    createdAfter: DateTime
    createdBefore: DateTime
  }

  input Pagination {
    page: Int = 1
    limit: Int = 10
  }

  input DateRange {
    startDate: DateTime!
    endDate: DateTime!
  }

  input CreateUserInput {
    email: String!
    password: String!
    role: UserRole = USER
    profile: UserProfileInput
  }

  input UserProfileInput {
    firstName: String
    lastName: String
    avatar: String
    phone: String
    address: String
    isActive: Boolean
  }

  input AnalyticsInput {
    metricType: String!
    value: Decimal!
    metadata: String
  }

  input ReportInput {
    title: String!
    type: ReportType!
  }

  input SalesMetricInput {
    date: DateTime!
    revenue: Decimal!
    orders: Int!
    customers: Int!
    channel: String!
  }

  input InventoryItemInput {
    sku: String
    name: String
    category: String
    stock: Int
    reserved: Int
    price: Decimal
    cost: Decimal
    supplier: String
  }

  # Connection Types
  type UserConnection {
    nodes: [User!]!
    totalCount: Int!
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  # Required Query Type
  type Query {
    # Core required queries
    users(filter: UserFilter, pagination: Pagination): UserConnection!
    analytics(dateRange: DateRange!): Analytics!
    reports(type: ReportType!): [Report!]!
    
    # Additional user queries
    user(id: ID!): User
    me: User

    # Additional analytics queries
    salesMetrics(dateRange: DateRange!, channel: String): [SalesMetric!]!
    customerMetrics(dateRange: DateRange!): CustomerMetrics!
    inventoryItems(category: String, lowStock: Boolean): [InventoryItem!]!

    # Additional report queries
    report(id: ID!): Report
  }

  # Required Mutation Type
  type Mutation {
    # Core required mutations
    createUser(input: CreateUserInput!): User!
    updateAnalytics(input: AnalyticsInput!): Analytics!
    generateReport(input: ReportInput!): Report!

    # Auth mutations
    login(email: String!, password: String!): AuthPayload!
    register(input: CreateUserInput!): AuthPayload!

    # Additional user mutations
    updateUser(id: ID!, input: CreateUserInput!): User!
    deleteUser(id: ID!): Boolean!

    # Additional analytics mutations
    addSalesMetric(input: SalesMetricInput!): SalesMetric!
    updateInventoryItem(id: ID!, input: InventoryItemInput!): InventoryItem!

    # Additional report mutations
    deleteReport(id: ID!): Boolean!
  }

  # Required Subscription Type
  type Subscription {
    # Core required subscriptions
    analyticsUpdated: Analytics!
    userStatusChanged(userId: ID!): User!

    # Additional subscriptions
    salesMetricAdded: SalesMetric!
    inventoryUpdated: InventoryItem!
    reportStatusChanged(reportId: ID!): Report!
  }
`;
