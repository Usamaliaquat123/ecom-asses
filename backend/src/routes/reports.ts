import express from 'express'
import { query, validationResult } from 'express-validator'
import { PrismaClient } from '@prisma/client'
import { authenticateToken, requireAdminOrModerator } from '../middleware/auth'
import { asyncHandler } from '../middleware/errorHandler'

const router = express.Router()

// Apply authentication
router.use(authenticateToken)

// GET /api/reports/export - Export data as CSV/JSON
router.get('/export', [
  query('type').isIn(['users', 'analytics', 'sales']).withMessage('Invalid export type'),
  query('format').optional().isIn(['csv', 'json']).withMessage('Invalid format'),
  query('startDate').optional().isISO8601().withMessage('Invalid start date'),
  query('endDate').optional().isISO8601().withMessage('Invalid end date')
], requireAdminOrModerator, asyncHandler(async (req: any, res: any) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    })
  }

  const { type, format = 'json', startDate, endDate } = req.query
  const prisma = req.prisma as PrismaClient

  let data: any[] = []
  let filename = ''

  try {
    switch (type) {
      case 'users':
        const users = await prisma.user.findMany({
          include: { profile: true },
          where: {
            ...(startDate && endDate && {
              createdAt: {
                gte: new Date(startDate),
                lte: new Date(endDate)
              }
            })
          }
        })
        
        data = users.map(user => ({
          id: user.id,
          email: user.email,
          role: user.role,
          firstName: user.profile?.firstName,
          lastName: user.profile?.lastName,
          phone: user.profile?.phone,
          isActive: user.profile?.isActive,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }))
        filename = `users-export-${Date.now()}`
        break

      case 'analytics':
        const analytics = await prisma.analyticsData.findMany({
          where: {
            ...(startDate && endDate && {
              recordedAt: {
                gte: new Date(startDate),
                lte: new Date(endDate)
              }
            })
          },
          include: { user: { include: { profile: true } } }
        })
        
        data = analytics.map(item => ({
          id: item.id,
          metricType: item.metricType,
          value: item.value,
          metadata: item.metadata,
          recordedAt: item.recordedAt,
          userEmail: item.user.email,
          userName: `${item.user.profile?.firstName} ${item.user.profile?.lastName}`
        }))
        filename = `analytics-export-${Date.now()}`
        break

      case 'sales':
        const sales = await prisma.salesMetric.findMany({
          where: {
            ...(startDate && endDate && {
              date: {
                gte: new Date(startDate),
                lte: new Date(endDate)
              }
            })
          }
        })
        
        data = sales
        filename = `sales-export-${Date.now()}`
        break

      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid export type'
        })
    }

    if (format === 'csv') {
      // Convert to CSV
      if (data.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No data found for export'
        })
      }

      const headers = Object.keys(data[0]).join(',')
      const rows = data.map(row => 
        Object.values(row).map(value => 
          typeof value === 'string' ? `"${value}"` : value
        ).join(',')
      )
      const csv = [headers, ...rows].join('\n')

      res.setHeader('Content-Type', 'text/csv')
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.csv"`)
      res.send(csv)
    } else {
      // Return JSON
      res.setHeader('Content-Type', 'application/json')
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.json"`)
      res.json({
        success: true,
        data,
        exportInfo: {
          type,
          format,
          count: data.length,
          exportedAt: new Date().toISOString(),
          ...(startDate && { startDate }),
          ...(endDate && { endDate })
        }
      })
    }
  } catch (error) {
    console.error('Export error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to export data'
    })
  }
}))

// GET /api/reports/summary - Get reports summary
router.get('/summary', requireAdminOrModerator, asyncHandler(async (req: any, res: any) => {
  const prisma = req.prisma as PrismaClient

  const [
    totalUsers,
    activeUsers,
    totalReports,
    recentReports
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({
      where: { profile: { isActive: true } }
    }),
    prisma.report.count(),
    prisma.report.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: { include: { profile: true } } }
    })
  ])

  res.json({
    success: true,
    data: {
      summary: {
        totalUsers,
        activeUsers,
        inactiveUsers: totalUsers - activeUsers,
        totalReports
      },
      recentReports: recentReports.map(report => ({
        id: report.id,
        title: report.title,
        status: report.status,
        createdAt: report.createdAt,
        generatedBy: {
          name: `${report.user.profile?.firstName} ${report.user.profile?.lastName}`,
          email: report.user.email
        }
      }))
    }
  })
}))

export default router
