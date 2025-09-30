# GraphQL Test Queries

## Test Login Mutation

You can test the GraphQL login mutation using the following query:

### Login Mutation
```graphql
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
        isActive
      }
    }
  }
}
```

### Variables
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

### Test with curl
```bash
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation Login($email: String!, $password: String!) { login(email: $email, password: $password) { token user { id email role profile { firstName lastName isActive } } } }",
    "variables": {
      "email": "admin@example.com",
      "password": "password123"
    }
  }'
```

## Other Available Queries

### Get Current User (requires authentication)
```graphql
query Me {
  me {
    id
    email
    role
    profile {
      firstName
      lastName
      phone
      address
      isActive
    }
  }
}
```

### Get All Users (Admin only)
```graphql
query GetUsers($filter: UserFilter, $pagination: Pagination) {
  users(filter: $filter, pagination: $pagination) {
    nodes {
      id
      email
      role
      profile {
        firstName
        lastName
        isActive
      }
    }
    totalCount
    hasNextPage
    hasPreviousPage
  }
}
```

## GraphQL Playground

Once the server is running, you can access GraphQL Playground at:
`http://localhost:4000/graphql`

This provides an interactive interface to test queries and mutations.
