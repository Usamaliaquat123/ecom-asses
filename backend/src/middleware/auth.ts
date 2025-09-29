import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

interface AuthRequest extends Request {
  user?: {
    id: number
    email: string
    role: string
  }
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access token required' 
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    
    // Fetch user from database to ensure they still exist
    const prisma = req.prisma as PrismaClient
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { profile: true }
    })

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token - user not found' 
      })
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role
    }

    next()
  } catch (error) {
    console.error('Auth middleware error:', error)
    return res.status(403).json({ 
      success: false, 
      message: 'Invalid or expired token' 
    })
  }
}

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Insufficient permissions' 
      })
    }

    next()
  }
}

export const requireAdmin = requireRole(['ADMIN'])
export const requireAdminOrModerator = requireRole(['ADMIN', 'MODERATOR'])
