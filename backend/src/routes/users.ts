import express from 'express'
import { body, query, param, validationResult } from 'express-validator'
import { PrismaClient } from '@prisma/client'
import { authenticateToken, requireAdminOrModerator } from '../middleware/auth'
import { hashPassword } from '../utils/auth'
import { asyncHandler } from '../middleware/errorHandler'

const router = express.Router()

// Apply authentication to all user routes
router.use(authenticateToken)

// GET /api/users - Get all users with filtering, sorting, and pagination
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('search').optional().isString(),
  query('role').optional().isIn(['ADMIN', 'USER', 'MODERATOR']),
  query('status').optional().isIn(['active', 'inactive']),
  query('sortBy').optional().isIn(['createdAt', 'email', 'firstName', 'lastName']),
  query('sortOrder').optional().isIn(['asc', 'desc'])
], requireAdminOrModerator, asyncHandler(async (req: any, res: any) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    })
  }

  const {
    page = 1,
    limit = 10,
    search,
    role,
    status,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query

  const prisma = req.prisma as PrismaClient
  const skip = (parseInt(page) - 1) * parseInt(limit)

  // Build where clause
  const where: any = {}
  
  if (search) {
    where.OR = [
      { email: { contains: search, mode: 'insensitive' } },
      { profile: { firstName: { contains: search, mode: 'insensitive' } } },
      { profile: { lastName: { contains: search, mode: 'insensitive' } } }
    ]
  }

  if (role) {
    where.role = role
  }

  if (status) {
    where.profile = {
      ...where.profile,
      isActive: status === 'active'
    }
  }

  // Build orderBy clause
  let orderBy: any = {}
  if (sortBy === 'firstName' || sortBy === 'lastName') {
    orderBy = { profile: { [sortBy]: sortOrder } }
  } else {
    orderBy = { [sortBy]: sortOrder }
  }

  const [users, totalCount] = await Promise.all([
    prisma.user.findMany({
      where,
      include: {
        profile: true
      },
      orderBy,
      skip,
      take: parseInt(limit)
    }),
    prisma.user.count({ where })
  ])

  const totalPages = Math.ceil(totalCount / parseInt(limit))

  res.json({
    success: true,
    data: {
      users: users.map(user => ({
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.profile?.firstName,
        lastName: user.profile?.lastName,
        phone: user.profile?.phone,
        address: user.profile?.address,
        isActive: user.profile?.isActive,
        status: user.profile?.isActive ? 'active' : 'inactive',
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      })),
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: totalCount,
        itemsPerPage: parseInt(limit),
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    }
  })
}))

// GET /api/users/:id - Get user by ID
router.get('/:id', [
  param('id').isInt().withMessage('User ID must be a number')
], requireAdminOrModerator, asyncHandler(async (req: any, res: any) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    })
  }

  const { id } = req.params
  const prisma = req.prisma as PrismaClient

  const user = await prisma.user.findUnique({
    where: { id: parseInt(id) },
    include: {
      profile: true
    }
  })

  if (!user) {
    return res.status(404).json({
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
        firstName: user.profile?.firstName,
        lastName: user.profile?.lastName,
        phone: user.profile?.phone,
        address: user.profile?.address,
        isActive: user.profile?.isActive,
        status: user.profile?.isActive ? 'active' : 'inactive',
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    }
  })
}))

// POST /api/users - Create new user
router.post('/', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('phone').notEmpty().withMessage('Phone is required'),
  body('address').notEmpty().withMessage('Address is required'),
  body('role').optional().isIn(['ADMIN', 'USER', 'MODERATOR'])
], requireAdminOrModerator, asyncHandler(async (req: any, res: any) => {
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
          address,
          isActive: true
        }
      }
    },
    include: {
      profile: true
    }
  })

  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.profile?.firstName,
        lastName: user.profile?.lastName,
        phone: user.profile?.phone,
        address: user.profile?.address,
        isActive: user.profile?.isActive,
        status: user.profile?.isActive ? 'active' : 'inactive',
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    }
  })
}))

// PUT /api/users/:id - Update user
router.put('/:id', [
  param('id').isInt().withMessage('User ID must be a number'),
  body('email').optional().isEmail().normalizeEmail(),
  body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('firstName').optional().notEmpty(),
  body('lastName').optional().notEmpty(),
  body('phone').optional().notEmpty(),
  body('address').optional().notEmpty(),
  body('role').optional().isIn(['ADMIN', 'USER', 'MODERATOR']),
  body('isActive').optional().isBoolean()
], requireAdminOrModerator, asyncHandler(async (req: any, res: any) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    })
  }

  const { id } = req.params
  const { email, password, firstName, lastName, phone, address, role, isActive } = req.body
  const prisma = req.prisma as PrismaClient

  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { id: parseInt(id) },
    include: { profile: true }
  })

  if (!existingUser) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    })
  }

  // Check if email is already taken by another user
  if (email && email !== existingUser.email) {
    const emailExists = await prisma.user.findUnique({
      where: { email }
    })

    if (emailExists) {
      return res.status(409).json({
        success: false,
        message: 'Email is already taken by another user'
      })
    }
  }

  // Prepare update data
  const updateData: any = {}
  const profileUpdateData: any = {}

  if (email) updateData.email = email
  if (role) updateData.role = role
  if (password) updateData.passwordHash = await hashPassword(password)

  if (firstName !== undefined) profileUpdateData.firstName = firstName
  if (lastName !== undefined) profileUpdateData.lastName = lastName
  if (phone !== undefined) profileUpdateData.phone = phone
  if (address !== undefined) profileUpdateData.address = address
  if (isActive !== undefined) profileUpdateData.isActive = isActive

  // Update user and profile
  const updatedUser = await prisma.user.update({
    where: { id: parseInt(id) },
    data: {
      ...updateData,
      ...(Object.keys(profileUpdateData).length > 0 && {
        profile: {
          update: profileUpdateData
        }
      })
    },
    include: {
      profile: true
    }
  })

  res.json({
    success: true,
    message: 'User updated successfully',
    data: {
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        role: updatedUser.role,
        firstName: updatedUser.profile?.firstName,
        lastName: updatedUser.profile?.lastName,
        phone: updatedUser.profile?.phone,
        address: updatedUser.profile?.address,
        isActive: updatedUser.profile?.isActive,
        status: updatedUser.profile?.isActive ? 'active' : 'inactive',
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt
      }
    }
  })
}))

// DELETE /api/users/:id - Delete user
router.delete('/:id', [
  param('id').isInt().withMessage('User ID must be a number')
], requireAdminOrModerator, asyncHandler(async (req: any, res: any) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    })
  }

  const { id } = req.params
  const prisma = req.prisma as PrismaClient

  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { id: parseInt(id) }
  })

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    })
  }

  // Prevent self-deletion
  if (user.id === req.user.id) {
    return res.status(400).json({
      success: false,
      message: 'Cannot delete your own account'
    })
  }

  // Delete user (profile will be deleted due to cascade)
  await prisma.user.delete({
    where: { id: parseInt(id) }
  })

  res.json({
    success: true,
    message: 'User deleted successfully'
  })
}))

export default router
