import express from 'express'
import { body, validationResult } from 'express-validator'
import { PrismaClient } from '@prisma/client'
import { authenticateToken, requireAdminOrModerator } from '../middleware/auth'
import { asyncHandler } from '../middleware/errorHandler'

const router = express.Router()

// POST /api/integrations/webhook - Handle webhook from external services
router.post('/webhook', [
  body('source').notEmpty().withMessage('Source is required'),
  body('event').notEmpty().withMessage('Event is required'),
  body('data').isObject().withMessage('Data must be an object')
], asyncHandler(async (req: any, res: any) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    })
  }

  const { source, event, data, timestamp } = req.body
  const prisma = req.prisma as PrismaClient

  try {
    // Log the webhook for audit purposes
    console.log(`Webhook received from ${source}:`, { event, data, timestamp })

    // Process different webhook events
    switch (source.toLowerCase()) {
      case 'stripe':
        await handleStripeWebhook(event, data, prisma)
        break
      
      case 'shopify':
        await handleShopifyWebhook(event, data, prisma)
        break
      
      case 'analytics':
        await handleAnalyticsWebhook(event, data, prisma)
        break
      
      default:
        console.log(`Unknown webhook source: ${source}`)
    }

    res.json({
      success: true,
      message: 'Webhook processed successfully',
      data: {
        source,
        event,
        processedAt: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Webhook processing error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to process webhook'
    })
  }
}))

// Helper functions for different webhook sources
async function handleStripeWebhook(event: string, data: any, prisma: PrismaClient) {
  switch (event) {
    case 'payment_intent.succeeded':
      // Record successful payment
      await prisma.analyticsData.create({
        data: {
          userId: 1, // System user for external events
          metricType: 'payment_success',
          value: data.amount / 100, // Convert cents to dollars
          metadata: {
            paymentId: data.id,
            currency: data.currency,
            source: 'stripe'
          }
        }
      })
      break
    
    case 'customer.created':
      // Record new customer
      await prisma.analyticsData.create({
        data: {
          userId: 1,
          metricType: 'new_customer',
          value: 1,
          metadata: {
            customerId: data.id,
            email: data.email,
            source: 'stripe'
          }
        }
      })
      break
  }
}

async function handleShopifyWebhook(event: string, data: any, prisma: PrismaClient) {
  switch (event) {
    case 'orders/create':
      // Record new order
      await prisma.salesMetric.create({
        data: {
          date: new Date(),
          revenue: parseFloat(data.total_price),
          orders: 1,
          customers: 1,
          channel: 'shopify'
        }
      })
      break
    
    case 'orders/updated':
      // Update existing order metrics if needed
      console.log('Order updated:', data.id)
      break
  }
}

async function handleAnalyticsWebhook(event: string, data: any, prisma: PrismaClient) {
  switch (event) {
    case 'page_view':
      await prisma.analyticsData.create({
        data: {
          userId: 1,
          metricType: 'page_view',
          value: 1,
          metadata: {
            page: data.page,
            userAgent: data.userAgent,
            source: 'analytics'
          }
        }
      })
      break
    
    case 'conversion':
      await prisma.analyticsData.create({
        data: {
          userId: 1,
          metricType: 'conversion',
          value: data.value || 1,
          metadata: {
            type: data.type,
            source: 'analytics'
          }
        }
      })
      break
  }
}

// GET /api/integrations/status - Get integration status
router.get('/status', authenticateToken, requireAdminOrModerator, asyncHandler(async (req: any, res: any) => {
  // This would typically check the status of various integrations
  const integrations = [
    {
      name: 'Stripe',
      status: 'connected',
      lastSync: new Date().toISOString(),
      webhookUrl: `${process.env.BASE_URL}/api/integrations/webhook`
    },
    {
      name: 'Shopify',
      status: 'connected',
      lastSync: new Date().toISOString(),
      webhookUrl: `${process.env.BASE_URL}/api/integrations/webhook`
    },
    {
      name: 'Google Analytics',
      status: 'pending',
      lastSync: null,
      webhookUrl: `${process.env.BASE_URL}/api/integrations/webhook`
    }
  ]

  res.json({
    success: true,
    data: { integrations }
  })
}))

// POST /api/integrations/test - Test webhook endpoint
router.post('/test', authenticateToken, requireAdminOrModerator, [
  body('source').notEmpty().withMessage('Source is required'),
  body('event').notEmpty().withMessage('Event is required')
], asyncHandler(async (req: any, res: any) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    })
  }

  const { source, event } = req.body

  // Simulate webhook data
  const testData = {
    source,
    event,
    data: {
      id: 'test_' + Date.now(),
      amount: 2500,
      currency: 'usd',
      email: 'test@example.com'
    },
    timestamp: new Date().toISOString()
  }

  res.json({
    success: true,
    message: 'Test webhook data generated',
    data: testData,
    webhookUrl: `${process.env.BASE_URL}/api/integrations/webhook`
  })
}))

export default router
