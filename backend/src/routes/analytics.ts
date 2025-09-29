import express from 'express'
import { query, validationResult } from 'express-validator'
import { PrismaClient } from '@prisma/client'
import { authenticateToken } from '../middleware/auth'
import { asyncHandler } from '../middleware/errorHandler'

const router = express.Router()

// Apply authentication
router.use(authenticateToken)

// GET /api/analytics/dashboard - Get dashboard analytics
router.get('/dashboard', [
  query('period').optional().isIn(['7d', '30d', '90d', '1y']).withMessage('Invalid period'),
  query('timezone').optional().isString()
], asyncHandler(async (req: any, res: any) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    })
  }

  const { period = '30d' } = req.query
  const prisma = req.prisma as PrismaClient

  // Calculate date range based on period
  const now = new Date()
  const startDate = new Date()
  
  switch (period) {
    case '7d':
      startDate.setDate(now.getDate() - 7)
      break
    case '30d':
      startDate.setDate(now.getDate() - 30)
      break
    case '90d':
      startDate.setDate(now.getDate() - 90)
      break
    case '1y':
      startDate.setFullYear(now.getFullYear() - 1)
      break
  }

  try {
    // Get user statistics
    const [
      totalUsers,
      activeUsers,
      newUsersInPeriod,
      totalRoles
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: { profile: { isActive: true } }
      }),
      prisma.user.count({
        where: {
          createdAt: { gte: startDate }
        }
      }),
      prisma.user.groupBy({
        by: ['role'],
        _count: { role: true }
      })
    ])

    // Get user growth data
    const userGrowthData = await prisma.user.groupBy({
      by: ['createdAt'],
      _count: { id: true },
      where: {
        createdAt: { gte: startDate }
      },
      orderBy: { createdAt: 'asc' }
    })

    // Process user growth data by day
    const dailyGrowth = processGrowthData(userGrowthData, startDate, now)

    // Get analytics data
    const analyticsData = await prisma.analyticsData.findMany({
      where: {
        recordedAt: { gte: startDate }
      },
      orderBy: { recordedAt: 'desc' },
      take: 100
    })

    // Get recent activity
    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { profile: true }
    })

    // Calculate system activity (mock calculation)
    const systemActivity = 98.5 + (Math.random() * 2 - 1) // 97.5 - 99.5%

    // Calculate growth percentages (mock for now)
    const userGrowthPercent = newUsersInPeriod > 0 ? 12 : 0
    const activeUserGrowthPercent = 8
    const systemActivityGrowth = 0.5

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          activeUsers,
          totalRoles: totalRoles.length,
          systemActivity: Math.round(systemActivity * 10) / 10,
          growth: {
            users: userGrowthPercent,
            activeUsers: activeUserGrowthPercent,
            systemActivity: systemActivityGrowth
          }
        },
        charts: {
          userGrowth: dailyGrowth,
          usersByRole: totalRoles.map(role => ({
            role: role.role,
            count: role._count.role,
            percentage: Math.round((role._count.role / totalUsers) * 100)
          })),
          activityData: generateActivityData(period)
        },
        recentActivity: recentUsers.map(user => ({
          id: user.id,
          name: `${user.profile?.firstName || ''} ${user.profile?.lastName || ''}`.trim() || user.email,
          email: user.email,
          role: user.role,
          action: 'User registered',
          timestamp: user.createdAt,
          avatar: user.profile?.avatar
        })),
        period,
        generatedAt: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Dashboard analytics error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard analytics'
    })
  }
}))

// GET /api/analytics/users - Get user analytics
router.get('/users', [
  query('period').optional().isIn(['7d', '30d', '90d', '1y']),
  query('groupBy').optional().isIn(['day', 'week', 'month'])
], asyncHandler(async (req: any, res: any) => {
  const { period = '30d', groupBy = 'day' } = req.query
  const prisma = req.prisma as PrismaClient

  const now = new Date()
  const startDate = new Date()
  
  switch (period) {
    case '7d':
      startDate.setDate(now.getDate() - 7)
      break
    case '30d':
      startDate.setDate(now.getDate() - 30)
      break
    case '90d':
      startDate.setDate(now.getDate() - 90)
      break
    case '1y':
      startDate.setFullYear(now.getFullYear() - 1)
      break
  }

  const users = await prisma.user.findMany({
    where: {
      createdAt: { gte: startDate }
    },
    include: { profile: true },
    orderBy: { createdAt: 'asc' }
  })

  const analytics = {
    totalUsers: users.length,
    usersByRole: users.reduce((acc: any, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1
      return acc
    }, {}),
    usersByStatus: users.reduce((acc: any, user) => {
      const status = user.profile?.isActive ? 'active' : 'inactive'
      acc[status] = (acc[status] || 0) + 1
      return acc
    }, {}),
    registrationTrend: processUserRegistrationTrend(users, groupBy)
  }

  res.json({
    success: true,
    data: analytics
  })
}))

// Helper functions
function processGrowthData(data: any[], startDate: Date, endDate: Date) {
  const days = []
  const current = new Date(startDate)
  
  while (current <= endDate) {
    const dayStr = current.toISOString().split('T')[0]
    const dayData = data.filter(item => 
      item.createdAt.toISOString().split('T')[0] === dayStr
    )
    
    days.push({
      date: dayStr,
      users: dayData.reduce((sum, item) => sum + item._count.id, 0)
    })
    
    current.setDate(current.getDate() + 1)
  }
  
  return days
}

function generateActivityData(period: string) {
  const dataPoints = period === '7d' ? 7 : period === '30d' ? 30 : 90
  const data = []
  
  for (let i = dataPoints - 1; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    
    data.push({
      date: date.toISOString().split('T')[0],
      logins: Math.floor(Math.random() * 50) + 10,
      pageViews: Math.floor(Math.random() * 200) + 50,
      apiCalls: Math.floor(Math.random() * 100) + 20
    })
  }
  
  return data
}

function processUserRegistrationTrend(users: any[], groupBy: string) {
  // Group users by the specified time period
  const grouped = users.reduce((acc: any, user) => {
    let key = ''
    const date = new Date(user.createdAt)
    
    switch (groupBy) {
      case 'day':
        key = date.toISOString().split('T')[0]
        break
      case 'week':
        const weekStart = new Date(date)
        weekStart.setDate(date.getDate() - date.getDay())
        key = weekStart.toISOString().split('T')[0]
        break
      case 'month':
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        break
    }
    
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})
  
  return Object.entries(grouped).map(([date, count]) => ({
    date,
    count
  }))
}

export default router
