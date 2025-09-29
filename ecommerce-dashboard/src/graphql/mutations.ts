import { gql } from '@apollo/client';

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
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
  }
`;

export const REGISTER = gql`
  mutation Register($input: CreateUserInput!) {
    register(input: $input) {
      token
      user {
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
  }
`;

export const ADD_SALES_METRIC = gql`
  mutation AddSalesMetric($input: SalesMetricInput!) {
    addSalesMetric(input: $input) {
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

export const UPDATE_INVENTORY_ITEM = gql`
  mutation UpdateInventoryItem($id: ID!, $input: InventoryItemInput!) {
    updateInventoryItem(id: $id, input: $input) {
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

export const GENERATE_REPORT = gql`
  mutation GenerateReport($input: ReportInput!) {
    generateReport(input: $input) {
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

export const DELETE_REPORT = gql`
  mutation DeleteReport($id: ID!) {
    deleteReport(id: $id)
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
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

export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $input: CreateUserInput!) {
    updateUser(id: $id, input: $input) {
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

export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;
