import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'
import { ApolloServer } from 'apollo-server-express'
import { createServer } from 'http'
import jwt from 'jsonwebtoken'

// Import routes
import authRoutes from './routes/auth'
import userRoutes from './routes/users'
import uploadRoutes from './routes/upload'
import reportRoutes from './routes/reports'
import integrationRoutes from './routes/integrations'
import analyticsRoutes from './routes/analytics'

// Import middleware
import { errorHandler } from './middleware/errorHandler'
import { notFound } from './middleware/notFound'

// Import GraphQL schema and resolvers
import { typeDefs } from './types/typeDefs'
import { resolvers } from './resolvers'
import type { Context } from './types/context'

dotenv.config()

const app = express()
const prisma = new PrismaClient()
const PORT = process.env.PORT || 4000

// Create HTTP server
const httpServer = createServer(app)


// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for GraphQL Playground
  crossOriginEmbedderPolicy: false
}))

const corsOptions = {
  origin: process.env.FRONTEND_URL ? 
    process.env.FRONTEND_URL.split(',') : 
    ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}

app.use(cors(corsOptions))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
})
app.use('/api/', limiter)

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Logging middleware
app.use(morgan('combined'))

// Make Prisma available in request context
app.use((req, res, next) => {
  req.prisma = prisma
  next()
})

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/reports', reportRoutes)
app.use('/api/integrations', integrationRoutes)
app.use('/api/analytics', analyticsRoutes)

// Authentication helper for GraphQL context
const getUser = async (token: string) => {
  try {
    if (!token) return null
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { profile: true }
    })
    return user
  } catch (error) {
    return null
  }
}

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req, res }: { req: any; res: any }): Promise<Context> => {
    const token = req.headers.authorization?.replace('Bearer ', '')
    const user = token ? await getUser(token) : null
    return { prisma, req, res, user }
  },
  introspection: true,
})

// Start server
async function startServer() {
  await server.start()
  
  // Apply GraphQL middleware
  server.applyMiddleware({ 
    app, 
    path: '/graphql',
    cors: corsOptions
  })

  // Error handling middleware (after GraphQL)
  app.use(notFound)
  app.use(errorHandler)

  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log('Received SIGINT, shutting down gracefully...')
    await server.stop()
    await prisma.$disconnect()
    process.exit(0)
  })

  process.on('SIGTERM', async () => {
    console.log('Received SIGTERM, shutting down gracefully...')
    await server.stop()
    await prisma.$disconnect()
    process.exit(0)
  })

  httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`)
    console.log(`📊 Health check: http://localhost:${PORT}/health`)
    console.log(`🎯 GraphQL endpoint: http://localhost:${PORT}${server.graphqlPath}`)
  })
}

startServer().catch((error) => {
  console.error('Failed to start server:', error)
  process.exit(1)
})

export default app