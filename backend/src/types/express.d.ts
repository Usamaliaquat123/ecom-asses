import { PrismaClient } from '@prisma/client'

declare global {
  namespace Express {
    interface Request {
      prisma: PrismaClient
      user?: {
        id: number
        email: string
        role: string
      }
    }
  }
}

export {}
