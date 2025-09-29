# E-Commerce Analytics Dashboard

A comprehensive full-stack e-commerce analytics dashboard built with Next.js, GraphQL, and PostgreSQL. This application provides real-time insights into sales, inventory, and customer data across multiple channels.

## 🚀 Features

### Frontend (Next.js)
- **Modern UI**: Responsive design with Tailwind CSS
- **Real-time Analytics**: Interactive charts and dashboards
- **State Management**: Redux Toolkit for client state
- **Data Fetching**: Apollo Client with GraphQL subscriptions
- **Form Handling**: React Hook Form with Zod validation
- **Charts**: Chart.js integration for data visualization
- **Tables**: Advanced data tables with sorting, filtering, and pagination
- **Authentication**: JWT-based authentication system
- **Testing**: Jest unit tests and Cypress E2E tests

### Backend (GraphQL API)
- **GraphQL API**: Type-safe API with queries, mutations, and subscriptions
- **Database**: PostgreSQL with Prisma ORM
- **Real-time Updates**: WebSocket subscriptions for live data
- **Authentication**: JWT token-based authentication
- **Authorization**: Role-based access control
- **Type Safety**: Full TypeScript implementation

### Key Analytics Features
- **Sales Metrics**: Revenue tracking, order analytics, channel performance
- **Customer Analytics**: Customer segmentation, growth metrics, retention analysis
- **Inventory Management**: Stock levels, low stock alerts, category analysis
- **Real-time Updates**: Live data updates via WebSocket subscriptions
- **Multi-channel Support**: Track performance across different sales channels

## 🛠 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Redux Toolkit** - State management
- **Apollo Client** - GraphQL client with caching
- **React Query** - Server state management
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Chart.js** - Data visualization
- **Lucide React** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Apollo Server** - GraphQL server
- **Express** - Web framework
- **Prisma** - Database ORM
- **PostgreSQL** - Database
- **GraphQL** - API query language
- **WebSocket** - Real-time communication
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing

### Testing
- **Jest** - Unit testing framework
- **Testing Library** - React component testing
- **Cypress** - End-to-end testing

## 📁 Project Structure

```
ecommerce-dashboard/
├── src/
│   ├── app/                 # Next.js app router pages
│   ├── components/          # React components
│   │   ├── charts/         # Chart components
│   │   ├── tables/         # Table components
│   │   └── forms/          # Form components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utilities and configurations
│   │   ├── features/       # Redux slices
│   │   ├── store.ts        # Redux store
│   │   └── apollo-client.ts # Apollo client setup
│   ├── graphql/            # GraphQL queries and mutations
│   └── utils/              # Utility functions
├── __tests__/              # Jest unit tests
├── cypress/                # Cypress E2E tests
└── public/                 # Static assets

backend/
├── src/
│   ├── types/              # TypeScript type definitions
│   ├── resolvers/          # GraphQL resolvers
│   ├── utils/              # Utility functions
│   └── index.ts            # Server entry point
├── prisma/
│   └── schema.prisma       # Database schema
└── package.json
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL 12+
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Update `.env` with your database credentials:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/ecommerce_dashboard"
   JWT_SECRET="your-super-secret-jwt-key"
   PORT=4000
   ```

4. **Set up database**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Start the backend server**
   ```bash
   npm run dev
   ```

   The GraphQL API will be available at `http://localhost:4000/graphql`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ecommerce-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.local.example .env.local
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

## 🧪 Testing

### Unit Tests (Jest)
```bash
cd ecommerce-dashboard
npm test
npm run test:coverage
```

### E2E Tests (Cypress)
```bash
cd ecommerce-dashboard
npm run cypress:open  # Interactive mode
npm run cypress:run   # Headless mode
```

## 📊 Database Schema

The application uses PostgreSQL with the following main entities:

- **Users**: User accounts with roles and profiles
- **Analytics Data**: Time-series analytics data
- **Sales Metrics**: Sales performance data
- **Customer Metrics**: Customer analytics
- **Inventory Items**: Product inventory management
- **Reports**: Generated reports and exports

## 🔐 Authentication

The application uses JWT-based authentication with the following features:

- User registration and login
- Role-based access control (Admin, Manager, User)
- Protected routes and API endpoints
- Token refresh mechanism

### Demo Credentials
- Email: `admin@example.com`
- Password: `password123`

## 🔄 Real-time Features

The dashboard includes real-time updates via GraphQL subscriptions:

- Live sales metrics updates
- Inventory level changes
- Customer analytics updates
- Report generation status

## 📈 Analytics Features

### Sales Analytics
- Revenue tracking over time
- Order volume analysis
- Channel performance comparison
- Average order value trends

### Customer Analytics
- Customer acquisition metrics
- Retention analysis
- Customer lifetime value
- Growth rate calculations

### Inventory Analytics
- Stock level monitoring
- Low stock alerts
- Category-wise inventory distribution
- Supplier performance tracking

## 🚀 Deployment

### Backend Deployment
1. Build the application: `npm run build`
2. Set production environment variables
3. Run database migrations: `npx prisma migrate deploy`
4. Start the server: `npm start`

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy to your preferred platform (Vercel, Netlify, etc.)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Apollo GraphQL for the excellent GraphQL implementation
- Prisma team for the fantastic ORM
- Chart.js for the beautiful charts
- Tailwind CSS for the utility-first CSS framework

---

Built with ❤️ for modern e-commerce analytics


