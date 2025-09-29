# Setup Instructions

## Quick Start

### 1. Install Dependencies

**Frontend:**
```bash
cd ecommerce-dashboard
npm install
```

**Backend:**
```bash
cd backend
npm install
```

### 2. Environment Setup

**Backend (.env):**
```env
DATABASE_URL="postgresql://username:password@localhost:5432/ecommerce_dashboard?schema=public"
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="7d"
PORT=4000
NODE_ENV="development"
FRONTEND_URL="http://localhost:3000"
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql
NEXT_PUBLIC_GRAPHQL_WS_URL=ws://localhost:4000/graphql
```

### 3. Database Setup

```bash
cd backend
npx prisma migrate dev
npx prisma generate
npm run seed
```

### 4. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd ecommerce-dashboard
npm run dev
```

### 5. Access the Application

- Frontend: http://localhost:3000
- Backend GraphQL Playground: http://localhost:4000/graphql
- Demo Login: admin@example.com / password123

## Troubleshooting

### Missing Dependencies
If you get module not found errors, make sure to install all dependencies:

```bash
# Frontend
cd ecommerce-dashboard
npm install graphql-ws @apollo/client @reduxjs/toolkit react-redux @tanstack/react-query

# Backend  
cd backend
npm install @graphql-tools/schema apollo-server-express prisma @prisma/client
```

### Database Issues
If you have database connection issues:

1. Make sure PostgreSQL is running
2. Create the database: `createdb ecommerce_dashboard`
3. Update the DATABASE_URL in .env
4. Run migrations: `npx prisma migrate dev`

### Port Conflicts
If ports 3000 or 4000 are in use:

- Frontend: Change port with `npm run dev -- -p 3001`
- Backend: Update PORT in .env file

