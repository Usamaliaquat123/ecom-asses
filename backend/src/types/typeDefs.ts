import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  scalar DateTime
  scalar Decimal

  enum UserRole {
    ADMIN
    USER
    MANAGER
  }

  enum ReportStatus {
    PENDING
    PROCESSING
    COMPLETED
    FAILED
  }

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
    createdAt: DateTime!
    updatedAt: DateTime!
  }

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

  type Analytics {
    salesData: [SalesMetric!]!
    customerMetrics: CustomerMetrics!
    inventoryStatus: [InventoryItem!]!
    totalRevenue: Decimal!
    totalOrders: Int!
    averageOrderValue: Decimal!
  }

  type Report {
    id: ID!
    title: String!
    generatedBy: User!
    filePath: String
    status: ReportStatus!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

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
  }

  input AnalyticsInput {
    metricType: String!
    value: Decimal!
    metadata: String
  }

  input ReportInput {
    title: String!
    type: String!
  }

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

  type Query {
    # User queries
    users(filter: UserFilter, pagination: Pagination): UserConnection!
    user(id: ID!): User
    me: User

    # Analytics queries
    analytics(dateRange: DateRange!): Analytics!
    salesMetrics(dateRange: DateRange!, channel: String): [SalesMetric!]!
    customerMetrics(dateRange: DateRange!): CustomerMetrics!
    inventoryItems(category: String, lowStock: Boolean): [InventoryItem!]!

    # Report queries
    reports(type: String): [Report!]!
    report(id: ID!): Report
  }

  type Mutation {
    # Auth mutations
    login(email: String!, password: String!): AuthPayload!
    register(input: CreateUserInput!): AuthPayload!

    # User mutations
    createUser(input: CreateUserInput!): User!
    updateUser(id: ID!, input: CreateUserInput!): User!
    deleteUser(id: ID!): Boolean!

    # Analytics mutations
    updateAnalytics(input: AnalyticsInput!): Analytics!
    addSalesMetric(input: SalesMetricInput!): SalesMetric!
    updateInventoryItem(id: ID!, input: InventoryItemInput!): InventoryItem!

    # Report mutations
    generateReport(input: ReportInput!): Report!
    deleteReport(id: ID!): Boolean!
  }

  type Subscription {
    # Real-time analytics updates
    analyticsUpdated: Analytics!
    salesMetricAdded: SalesMetric!
    inventoryUpdated: InventoryItem!

    # User status updates
    userStatusChanged(userId: ID!): User!
    reportStatusChanged(reportId: ID!): Report!
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
`;
