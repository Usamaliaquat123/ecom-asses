# Admin Panel Backend API Documentation

## Overview

The Admin Panel Backend API is a comprehensive REST API built with Express.js, TypeScript, and Prisma ORM. It provides authentication, user management, analytics, file upload, reporting, and integration capabilities for an e-commerce admin dashboard.

### Base Information
- **Base URL**: `http://localhost:4000/api`
- **Version**: 1.0.0
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT Bearer Token
- **Rate Limiting**: 100 requests per 15 minutes per IP

### Tech Stack
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (jsonwebtoken)
- **Security**: Helmet, CORS, Rate Limiting
- **File Upload**: Multer
- **Validation**: express-validator

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### User Roles
- **ADMIN**: Full system access
- **MODERATOR**: Content management and user operations
- **USER**: Standard access (limited permissions)

## API Endpoints

### 🔐 Authentication

#### Register User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "password123",
  "firstName": "Admin",
  "lastName": "User",
  "phone": "+1234567890",
  "address": "123 Main St, City, Country",
  "role": "ADMIN"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "email": "admin@example.com",
      "role": "ADMIN",
      "profile": {
        "firstName": "Admin",
        "lastName": "User",
        "phone": "+1234567890",
        "address": "123 Main St, City, Country",
        "isActive": true
      }
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login User
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "email": "admin@example.com",
      "role": "ADMIN",
      "profile": {
        "firstName": "Admin",
        "lastName": "User",
        "isActive": true
      }
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Get Current User
```http
GET /api/auth/me
```
**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "admin@example.com",
      "role": "ADMIN",
      "profile": {
        "firstName": "Admin",
        "lastName": "User",
        "phone": "+1234567890",
        "address": "123 Main St, City, Country",
        "isActive": true
      }
    }
  }
}
```

#### Logout User
```http
POST /api/auth/logout
```
**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

### 👥 User Management

#### Get All Users
```http
GET /api/users?page=1&limit=10&search=&role=&status=&sortBy=createdAt&sortOrder=desc
```
**Headers:** `Authorization: Bearer <token>`
**Permissions:** Admin/Moderator only

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `search` (optional): Search by email, first name, or last name
- `role` (optional): Filter by role (ADMIN, USER, MODERATOR)
- `status` (optional): Filter by status (active, inactive)
- `sortBy` (optional): Sort by field (createdAt, email, firstName, lastName)
- `sortOrder` (optional): Sort order (asc, desc)

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": 1,
        "email": "admin@example.com",
        "role": "ADMIN",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "profile": {
          "firstName": "Admin",
          "lastName": "User",
          "phone": "+1234567890",
          "address": "123 Main St",
          "isActive": true
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

#### Get User by ID
```http
GET /api/users/:id
```
**Headers:** `Authorization: Bearer <token>`
**Permissions:** Admin/Moderator only

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "admin@example.com",
      "role": "ADMIN",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "profile": {
        "firstName": "Admin",
        "lastName": "User",
        "phone": "+1234567890",
        "address": "123 Main St",
        "isActive": true
      }
    }
  }
}
```

#### Create User
```http
POST /api/users
```
**Headers:** `Authorization: Bearer <token>`
**Permissions:** Admin/Moderator only

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "address": "456 Oak St, City, Country",
  "role": "USER"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "user": {
      "id": 2,
      "email": "newuser@example.com",
      "role": "USER",
      "profile": {
        "firstName": "John",
        "lastName": "Doe",
        "phone": "+1234567890",
        "address": "456 Oak St, City, Country",
        "isActive": true
      }
    }
  }
}
```

#### Update User
```http
PUT /api/users/:id
```
**Headers:** `Authorization: Bearer <token>`
**Permissions:** Admin/Moderator only

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "phone": "+0987654321",
  "address": "789 Pine St, City, Country",
  "role": "MODERATOR",
  "isActive": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "user": {
      "id": 1,
      "email": "admin@example.com",
      "role": "MODERATOR",
      "profile": {
        "firstName": "Jane",
        "lastName": "Smith",
        "phone": "+0987654321",
        "address": "789 Pine St, City, Country",
        "isActive": true
      }
    }
  }
}
```

#### Delete User
```http
DELETE /api/users/:id
```
**Headers:** `Authorization: Bearer <token>`
**Permissions:** Admin/Moderator only

**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

### 📊 Analytics

#### Get Dashboard Analytics
```http
GET /api/analytics/dashboard?period=30d&timezone=UTC
```
**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `period` (optional): Time period (7d, 30d, 90d, 1y)
- `timezone` (optional): Timezone for date calculations (default: UTC)

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalUsers": 1250,
      "totalRevenue": 125000.50,
      "totalOrders": 3420,
      "averageOrderValue": 36.55
    },
    "trends": {
      "userGrowth": 12.5,
      "revenueGrowth": 8.3,
      "orderGrowth": 15.2
    },
    "charts": {
      "dailyRevenue": [
        { "date": "2024-01-01", "revenue": 1250.00 },
        { "date": "2024-01-02", "revenue": 1380.50 }
      ],
      "userRegistrations": [
        { "date": "2024-01-01", "users": 25 },
        { "date": "2024-01-02", "users": 32 }
      ]
    }
  }
}
```

#### Get User Analytics
```http
GET /api/analytics/users?period=30d&groupBy=day
```
**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `period` (optional): Time period (7d, 30d, 90d, 1y)
- `groupBy` (optional): Group by (day, week, month)

**Response:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 1250,
    "activeUsers": 980,
    "newUsers": 45,
    "usersByRole": {
      "ADMIN": 5,
      "MODERATOR": 15,
      "USER": 1230
    },
    "registrationTrend": [
      { "period": "2024-01-01", "count": 25 },
      { "period": "2024-01-02", "count": 32 }
    ]
  }
}
```

---

### 📁 File Upload

#### Upload Single File
```http
POST /api/upload
```
**Headers:** `Authorization: Bearer <token>`
**Content-Type:** `multipart/form-data`

**Form Data:**
- `file`: File to upload (max 10MB)

**Response:**
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "filename": "1704067200000-document.pdf",
    "originalName": "document.pdf",
    "size": 1024000,
    "mimetype": "application/pdf",
    "url": "/uploads/1704067200000-document.pdf"
  }
}
```

#### Upload Multiple Files
```http
POST /api/upload/multiple
```
**Headers:** `Authorization: Bearer <token>`
**Content-Type:** `multipart/form-data`

**Form Data:**
- `files`: Multiple files (max 10 files, 10MB each)

**Response:**
```json
{
  "success": true,
  "message": "Files uploaded successfully",
  "data": {
    "files": [
      {
        "filename": "1704067200000-image1.jpg",
        "originalName": "image1.jpg",
        "size": 512000,
        "mimetype": "image/jpeg",
        "url": "/uploads/1704067200000-image1.jpg"
      },
      {
        "filename": "1704067200001-image2.png",
        "originalName": "image2.png",
        "size": 768000,
        "mimetype": "image/png",
        "url": "/uploads/1704067200001-image2.png"
      }
    ]
  }
}
```

#### Delete File
```http
DELETE /api/upload/:filename
```
**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "File deleted successfully"
}
```

---

### 📋 Reports

#### Export Data (JSON)
```http
GET /api/reports/export?type=users&format=json&startDate=2024-01-01&endDate=2024-12-31
```
**Headers:** `Authorization: Bearer <token>`
**Permissions:** Admin/Moderator only

**Query Parameters:**
- `type`: Export type (users, analytics, sales)
- `format`: Export format (json, csv)
- `startDate`: Start date (ISO format)
- `endDate`: End date (ISO format)

**Response:**
```json
{
  "success": true,
  "data": {
    "export": {
      "type": "users",
      "format": "json",
      "dateRange": {
        "start": "2024-01-01",
        "end": "2024-12-31"
      },
      "recordCount": 1250,
      "data": [
        {
          "id": 1,
          "email": "admin@example.com",
          "role": "ADMIN",
          "createdAt": "2024-01-01T00:00:00.000Z"
        }
      ]
    }
  }
}
```

#### Export Data (CSV)
```http
GET /api/reports/export?type=analytics&format=csv&startDate=2024-01-01&endDate=2024-12-31
```
**Headers:** `Authorization: Bearer <token>`
**Permissions:** Admin/Moderator only
**Content-Type:** `text/csv`

Returns CSV file download.

#### Get Reports Summary
```http
GET /api/reports/summary
```
**Headers:** `Authorization: Bearer <token>`
**Permissions:** Admin/Moderator only

**Response:**
```json
{
  "success": true,
  "data": {
    "totalReports": 45,
    "recentReports": [
      {
        "id": 1,
        "title": "User Analytics Report",
        "status": "COMPLETED",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "filePath": "/reports/user-analytics-2024-01-01.pdf"
      }
    ],
    "reportsByStatus": {
      "COMPLETED": 40,
      "PROCESSING": 3,
      "PENDING": 2,
      "FAILED": 0
    }
  }
}
```

---

### 🔗 Integrations

#### Webhook Endpoint
```http
POST /api/integrations/webhook
```
**Content-Type:** `application/json`

**Request Body:**
```json
{
  "source": "stripe",
  "event": "payment_intent.succeeded",
  "data": {
    "id": "pi_1234567890",
    "amount": 2500,
    "currency": "usd",
    "status": "succeeded"
  },
  "timestamp": "2024-01-01T12:00:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Webhook processed successfully",
  "data": {
    "eventId": "evt_1234567890",
    "processed": true
  }
}
```

#### Get Integration Status
```http
GET /api/integrations/status
```
**Headers:** `Authorization: Bearer <token>`
**Permissions:** Admin/Moderator only

**Response:**
```json
{
  "success": true,
  "data": {
    "integrations": [
      {
        "name": "Stripe",
        "status": "active",
        "lastSync": "2024-01-01T12:00:00Z",
        "webhookUrl": "https://api.example.com/integrations/webhook"
      },
      {
        "name": "Shopify",
        "status": "inactive",
        "lastSync": null,
        "webhookUrl": null
      }
    ]
  }
}
```

#### Test Webhook
```http
POST /api/integrations/test
```
**Headers:** `Authorization: Bearer <token>`
**Permissions:** Admin/Moderator only

**Request Body:**
```json
{
  "source": "stripe",
  "event": "customer.created"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Webhook test successful",
  "data": {
    "testId": "test_1234567890",
    "result": "passed"
  }
}
```

---

### 🏥 Health Check

#### Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "uptime": 3600.5
}
```

---

## Error Responses

### Standard Error Format
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

---

## Database Schema

### User Model
```sql
users {
  id: Integer (Primary Key)
  email: String (Unique)
  password_hash: String
  role: UserRole (ADMIN, USER, MODERATOR)
  created_at: DateTime
  updated_at: DateTime
}
```

### User Profile Model
```sql
user_profiles {
  id: Integer (Primary Key)
  user_id: Integer (Foreign Key)
  first_name: String
  last_name: String
  avatar: String
  phone: String
  address: String
  is_active: Boolean
  created_at: DateTime
  updated_at: DateTime
}
```

### Analytics Data Model
```sql
analytics_data {
  id: Integer (Primary Key)
  user_id: Integer (Foreign Key)
  metric_type: String
  value: Decimal
  metadata: JSON
  recorded_at: DateTime
}
```

### Sales Metrics Model
```sql
sales_metrics {
  id: Integer (Primary Key)
  date: DateTime
  revenue: Decimal
  orders: Integer
  customers: Integer
  channel: String
  created_at: DateTime
}
```

### Customer Metrics Model
```sql
customer_metrics {
  id: Integer (Primary Key)
  date: DateTime
  total_customers: Integer
  new_customers: Integer
  returning_customers: Integer
  average_order_value: Decimal
  created_at: DateTime
}
```

### Inventory Items Model
```sql
inventory_items {
  id: Integer (Primary Key)
  sku: String (Unique)
  name: String
  category: String
  stock: Integer
  reserved: Integer
  price: Decimal
  cost: Decimal
  supplier: String
  last_updated: DateTime
  created_at: DateTime
}
```

---

## Environment Variables

Create a `.env` file based on `env.example`:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/admin_panel?schema=public"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-here-make-it-long-and-random"
JWT_REFRESH_SECRET="your-refresh-token-secret-here"
JWT_EXPIRES_IN="7d"

# Server Configuration
PORT=4000
NODE_ENV="development"
BASE_URL="http://localhost:4000"

# CORS
FRONTEND_URL="http://localhost:5173"

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_DIR="uploads"
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd backend

# Install dependencies
npm install

# Set up environment variables
cp env.example .env
# Edit .env with your configuration

# Set up database
npm run migrate
npm run generate
npm run seed

# Start development server
npm run dev
```

### Available Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run migrate` - Run database migrations
- `npm run generate` - Generate Prisma client
- `npm run studio` - Open Prisma Studio
- `npm run seed` - Seed database with sample data

---

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS Protection**: Configurable cross-origin resource sharing
- **Helmet**: Security headers middleware
- **Input Validation**: express-validator for request validation
- **SQL Injection Protection**: Prisma ORM with parameterized queries

---

## Testing with Postman

Import the provided `postman-collection.json` file into Postman to test all API endpoints. The collection includes:

- Pre-configured environment variables
- Automatic token management
- Request examples for all endpoints
- Test scripts for response validation

### Collection Variables
- `base_url`: API base URL (default: http://localhost:4000/api)
- `auth_token`: JWT token (automatically set after login)

---

## Support

For issues and questions:
1. Check the error response format
2. Verify authentication token
3. Ensure proper request format
4. Check rate limiting status
5. Review server logs for detailed error information

---

*Last updated: January 2024*
