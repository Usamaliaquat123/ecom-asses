import express from 'express'
import { body, validationResult } from 'express-validator'
import { PrismaClient } from '@prisma/client'
import { hashPassword, comparePassword, generateToken } from '../utils/auth'
import { asyncHandler } from '../middleware/errorHandler'

const router = express.Router()

// POST /api/auth/register
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('role').optional().isIn(['ADMIN', 'USER', 'MODERATOR'])
], asyncHandler(async (req: any, res: any) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    })
  }

  const { email, password, firstName, lastName, phone, address, role = 'USER' } = req.body
  const prisma = req.prisma as PrismaClient

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email }
  })

  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: 'User with this email already exists'
    })
  }

  // Hash password
  const passwordHash = await hashPassword(password)

  // Create user with profile
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      role,
      profile: {
        create: {
          firstName,
          lastName,
          phone,
          address
        }
      }
    },
    include: {
      profile: true
    }
  })

  // Generate token
  const token = generateToken(user.id, user.email, user.role)

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        profile: user.profile
      },
      token
    }
  })
}))

// POST /api/auth/login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required')
], asyncHandler(async (req: any, res: any) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    })
  }

  const { email, password } = req.body
  const prisma = req.prisma as PrismaClient

  // Find user with profile
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      profile: true
    }
  })

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    })
  }

  // Check password
  const isValidPassword = await comparePassword(password, user.passwordHash)
  if (!isValidPassword) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    })
  }

  // Check if user is active
  if (user.profile && !user.profile.isActive) {
    return res.status(401).json({
      success: false,
      message: 'Account is deactivated. Please contact administrator.'
    })
  }

  // Generate token
  const token = generateToken(user.id, user.email, user.role)

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        profile: user.profile
      },
      token
    }
  })
}))

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  // In a stateless JWT setup, logout is handled client-side
  // You could implement token blacklisting here if needed
  res.json({
    success: true,
    message: 'Logged out successfully'
  })
})

// GET /api/auth/me
router.get('/me', asyncHandler(async (req: any, res: any) => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No token provided'
    })
  }

  try {
    const jwt = require('jsonwebtoken')
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    const prisma = req.prisma as PrismaClient

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        profile: true
      }
    })

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      })
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          profile: user.profile
        }
      }
    })
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    })
  }
}))

export default router
