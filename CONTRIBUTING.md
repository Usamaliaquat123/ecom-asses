# Contributing Guide

Welcome to the E-Commerce System project! This guide will help you set up the development environment and get all three applications running locally.

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software
- **Node.js**: Version 18.0.0 or higher
- **npm** or **yarn**: Package manager (yarn is preferred)
- **PostgreSQL**: Version 12.0 or higher
- **Git**: For version control

### Recommended Tools
- **VS Code**: With recommended extensions
- **Postman**: For API testing (import the provided collection)
- **pgAdmin** or **DBeaver**: For database management
- **Docker** (optional): For containerized development

## 🏗️ Project Structure

```
ecomm/
├── backend/              # Express.js API server
├── admin-panel/          # Vue.js admin interface
├── ecommerce-dashboard/  # Next.js analytics dashboard
├── API.md               # API documentation
├── ARCHITECTURE.md      # System architecture
└── CONTRIBUTING.md      # This file
```

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ecomm
```

### 2. Install Dependencies for All Projects

```bash
# Install backend dependencies
cd backend
yarn install

# Install admin panel dependencies
cd ../admin-panel
yarn install

# Install dashboard dependencies
cd ../ecommerce-dashboard
yarn install

# Return to root directory
cd ..
```

### 3. Set Up Environment Variables

```bash
# Backend environment
cd backend
cp env.example .env

# Admin panel environment
cd ../admin-panel
cp env.local.example .env.local

# Dashboard environment
cd ../ecommerce-dashboard
cp env.local.example .env.local
```

### 4. Configure Database

```bash
# Create PostgreSQL database
createdb admin_panel

# Or using psql
psql -U postgres -c "CREATE DATABASE admin_panel;"
```

### 5. Set Up Backend Database

```bash
cd backend

# Generate Prisma client
yarn generate

# Run database migrations
yarn migrate

# Seed the database with sample data
yarn seed
```

### 6. Start All Services

Open three terminal windows/tabs:

```bash
# Terminal 1: Start Backend (Port 4000)
cd backend
yarn dev

# Terminal 2: Start Admin Panel (Port 5173)
cd admin-panel
yarn dev

# Terminal 3: Start Dashboard (Port 3000)
cd ecommerce-dashboard
yarn dev
```

## 🔧 Detailed Setup Instructions

### Backend Setup (Express.js + PostgreSQL)

#### 1. Environment Configuration

Edit `backend/.env` with your database credentials:

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
FRONTEND_URL="http://localhost:5173,http://localhost:3000"

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_DIR="uploads"
```

#### 2. Database Setup

```bash
cd backend

# Install dependencies
yarn install

# Generate Prisma client
yarn generate

# Create and run migrations
yarn migrate

# Seed database with sample data
yarn seed

# (Optional) Open Prisma Studio to view data
yarn studio
```

#### 3. Start Development Server

```bash
yarn dev
```

The backend will be available at `http://localhost:4000`

#### 4. Verify Backend Setup

- Health check: `http://localhost:4000/health`
- API documentation: See `API.md`
- Import Postman collection: `backend/postman-collection.json`

### Admin Panel Setup (Vue.js)

#### 1. Environment Configuration

Edit `admin-panel/.env.local`:

```env
# API Configuration
VITE_API_URL=http://localhost:4000/api

# App Configuration
VITE_APP_NAME="Admin Panel"
VITE_APP_VERSION="1.0.0"

# Development
VITE_DEV_MODE=true
```

#### 2. Install and Start

```bash
cd admin-panel

# Install dependencies
yarn install

# Start development server
yarn dev
```

The admin panel will be available at `http://localhost:5173`

#### 3. Default Login Credentials

```
Email: admin@example.com
Password: password123
```

#### 4. Available Scripts

```bash
yarn dev          # Start development server
yarn build        # Build for production
yarn preview      # Preview production build
yarn test:unit    # Run unit tests
yarn type-check   # TypeScript type checking
yarn storybook    # Start Storybook
```

### E-Commerce Dashboard Setup (Next.js)

#### 1. Environment Configuration

Edit `ecommerce-dashboard/.env.local`:

```env
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql
NEXT_PUBLIC_GRAPHQL_WS_URL=ws://localhost:4000/graphql
```

#### 2. Install and Start

```bash
cd ecommerce-dashboard

# Install dependencies
yarn install

# Start development server
yarn dev
```

The dashboard will be available at `http://localhost:3000`

#### 3. Available Scripts

```bash
yarn dev              # Start development server
yarn build            # Build for production
yarn start            # Start production server
yarn lint             # Run ESLint
yarn test             # Run Jest tests
yarn test:watch       # Run tests in watch mode
yarn test:coverage    # Run tests with coverage
yarn cypress:open     # Open Cypress E2E tests
yarn cypress:run      # Run Cypress tests headlessly
```

## 🧪 Testing

### Backend Testing

```bash
cd backend

# Run API tests with Postman collection
# Import postman-collection.json into Postman

# Test database connection
yarn studio

# Check API health
curl http://localhost:4000/health
```

### Admin Panel Testing

```bash
cd admin-panel

# Run unit tests
yarn test:unit

# Run tests in watch mode
yarn test:unit --watch

# Type checking
yarn type-check

# Build test
yarn build
```

### Dashboard Testing

```bash
cd ecommerce-dashboard

# Run Jest unit tests
yarn test

# Run tests with coverage
yarn test:coverage

# Run E2E tests
yarn cypress:run

# Open Cypress GUI
yarn cypress:open

# Lint code
yarn lint
```

## 🐛 Troubleshooting

### Common Issues

#### Database Connection Issues

```bash
# Check PostgreSQL is running
pg_ctl status

# Start PostgreSQL (macOS with Homebrew)
brew services start postgresql

# Start PostgreSQL (Linux)
sudo systemctl start postgresql

# Check database exists
psql -U postgres -l | grep admin_panel
```

#### Port Already in Use

```bash
# Find process using port 4000
lsof -i :4000

# Kill process
kill -9 <PID>

# Or use different ports in .env files
```

#### Node Version Issues

```bash
# Check Node version
node --version

# Use Node Version Manager (nvm)
nvm install 18
nvm use 18
```

#### Prisma Issues

```bash
cd backend

# Reset database (WARNING: This will delete all data)
yarn prisma migrate reset

# Generate client after schema changes
yarn generate

# Push schema changes without migration
yarn prisma db push
```

#### Build Issues

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json yarn.lock
yarn install

# Clear build cache
yarn build --clean
```

### Environment-Specific Issues

#### Windows Users

```bash
# Use PowerShell or Git Bash
# Install windows-build-tools if needed
npm install -g windows-build-tools

# Set execution policy for PowerShell scripts
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### macOS Users

```bash
# Install Xcode command line tools
xcode-select --install

# Install Homebrew if not installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

#### Linux Users

```bash
# Install build essentials
sudo apt-get install build-essential

# Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib
```

## 📝 Development Workflow

### 1. Before Starting Development

```bash
# Pull latest changes
git pull origin main

# Install any new dependencies
yarn install

# Update database schema if needed
cd backend && yarn migrate
```

### 2. Making Changes

```bash
# Create a new branch
git checkout -b feature/your-feature-name

# Make your changes
# Test your changes

# Commit your changes
git add .
git commit -m "feat: add your feature description"
```

### 3. Code Quality

```bash
# Run linting
yarn lint

# Run type checking
yarn type-check

# Run tests
yarn test

# Build to ensure no build errors
yarn build
```

### 4. Database Changes

```bash
cd backend

# Create new migration
yarn prisma migrate dev --name your_migration_name

# Generate client after schema changes
yarn generate

# Update seed file if needed
# Edit prisma/seed.ts
yarn seed
```

## 🔄 Development Scripts

### Useful Development Commands

```bash
# Start all services concurrently (requires concurrently package)
npm install -g concurrently
concurrently "cd backend && yarn dev" "cd admin-panel && yarn dev" "cd ecommerce-dashboard && yarn dev"

# Reset entire development environment
cd backend && yarn prisma migrate reset && yarn seed
cd ../admin-panel && rm -rf node_modules && yarn install
cd ../ecommerce-dashboard && rm -rf node_modules && yarn install
```

### Database Management

```bash
cd backend

# View database in browser
yarn studio

# Reset database with fresh data
yarn prisma migrate reset

# Deploy migrations to production
yarn prisma migrate deploy

# Generate Prisma client
yarn generate

# Seed database
yarn seed
```

## 📚 Additional Resources

### Documentation
- [API Documentation](./API.md)
- [Architecture Overview](./ARCHITECTURE.md)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Vue.js Documentation](https://vuejs.org/guide/)
- [Next.js Documentation](https://nextjs.org/docs)

### Tools & Extensions

#### VS Code Extensions
```json
{
  "recommendations": [
    "Vue.volar",
    "bradlc.vscode-tailwindcss",
    "Prisma.prisma",
    "ms-vscode.vscode-typescript-next",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint"
  ]
}
```

#### Browser Extensions
- Vue.js DevTools
- React Developer Tools
- Apollo Client DevTools

## 🤝 Contributing Guidelines

### Code Style
- Use TypeScript for all new code
- Follow existing code formatting (Prettier)
- Use meaningful variable and function names
- Add comments for complex logic

### Commit Messages
Follow conventional commits format:
```
feat: add new feature
fix: fix bug
docs: update documentation
style: formatting changes
refactor: code refactoring
test: add tests
chore: maintenance tasks
```

### Pull Request Process
1. Create feature branch from `main`
2. Make your changes
3. Test thoroughly
4. Update documentation if needed
5. Create pull request with clear description
6. Request review from maintainers

## 🆘 Getting Help

### Community Support
- Create an issue for bugs or feature requests
- Check existing issues before creating new ones
- Provide detailed information when reporting issues

### Development Support
- Include error messages and stack traces
- Specify your operating system and Node.js version
- Provide steps to reproduce the issue

---

## 📋 Quick Reference

### Default Ports
- Backend API: `http://localhost:4000`
- Admin Panel: `http://localhost:5173`
- Dashboard: `http://localhost:3000`
- Prisma Studio: `http://localhost:5555`

### Default Credentials
```
Email: admin@example.com
Password: password123
```

### Key Commands
```bash
# Start all services
yarn dev

# Database operations
yarn migrate
yarn generate
yarn seed
yarn studio

# Testing
yarn test
yarn lint
yarn type-check

# Building
yarn build
yarn start
```

---

*Happy coding! 🚀*
