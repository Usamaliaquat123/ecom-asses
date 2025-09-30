describe('Dashboard E2E Tests', () => {
  beforeEach(() => {
    // Mock the GraphQL API responses
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === 'Login') {
        req.reply({
          data: {
            login: {
              token: 'mock-jwt-token',
              user: {
                id: '1',
                email: 'test@example.com',
                role: 'USER',
                profile: {
                  firstName: 'Test',
                  lastName: 'User',
                  avatar: null,
                  phone: null,
                },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            },
          },
        })
      } else if (req.body.operationName === 'GetAnalytics') {
        req.reply({
          data: {
            analytics: {
              salesData: [
                {
                  id: '1',
                  date: new Date().toISOString(),
                  revenue: 1000,
                  orders: 10,
                  customers: 8,
                  channel: 'online',
                  createdAt: new Date().toISOString(),
                },
              ],
              customerMetrics: {
                totalCustomers: 1000,
                newCustomers: 100,
                returningCustomers: 900,
                averageOrderValue: 200,
                growthRate: 5.5,
              },
              inventoryStatus: [
                {
                  id: '1',
                  sku: 'TEST-001',
                  name: 'Test Product',
                  category: 'Electronics',
                  stock: 50,
                  reserved: 5,
                  price: 99.99,
                  cost: 50.00,
                  supplier: 'Test Supplier',
                  lastUpdated: new Date().toISOString(),
                  createdAt: new Date().toISOString(),
                },
              ],
              totalRevenue: 100000,
              totalOrders: 500,
              averageOrderValue: 200,
            },
          },
        })
      }
    }).as('graphqlRequest')

    cy.visit('/')
  })

  it('should display login form when not authenticated', () => {
    cy.get('h2').should('contain', 'Sign in to your account')
    cy.get('input[type="email"]').should('be.visible')
    cy.get('input[type="password"]').should('be.visible')
    cy.get('button[type="submit"]').should('contain', 'Sign In')
  })

  it('should login successfully with valid credentials', () => {
    cy.get('input[type="email"]').type('test@example.com')
    cy.get('input[type="password"]').type('password123')
    cy.get('button[type="submit"]').click()

    cy.wait('@graphqlRequest')
    
    // Should redirect to dashboard
    cy.get('h1').should('contain', 'Dashboard')
    cy.get('[data-testid="line-chart"]').should('be.visible')
  })

  it('should display key metrics on dashboard', () => {
    // Login first
    cy.get('input[type="email"]').type('test@example.com')
    cy.get('input[type="password"]').type('password123')
    cy.get('button[type="submit"]').click()
    cy.wait('@graphqlRequest')

    // Check metrics
    cy.contains('Total Revenue').should('be.visible')
    cy.contains('Total Orders').should('be.visible')
    cy.contains('Total Customers').should('be.visible')
    cy.contains('Avg Order Value').should('be.visible')
  })

  it('should display charts and tables', () => {
    // Login first
    cy.get('input[type="email"]').type('test@example.com')
    cy.get('input[type="password"]').type('password123')
    cy.get('button[type="submit"]').click()
    cy.wait('@graphqlRequest')

    // Check charts
    cy.get('[data-testid="line-chart"]').should('be.visible')
    cy.get('[data-testid="doughnut-chart"]').should('be.visible')
    cy.get('[data-testid="bar-chart"]').should('be.visible')

    // Check inventory table
    cy.contains('Inventory Overview').should('be.visible')
    cy.contains('TEST-001').should('be.visible')
    cy.contains('Test Product').should('be.visible')
  })

  it('should allow searching in inventory table', () => {
    // Login first
    cy.get('input[type="email"]').type('test@example.com')
    cy.get('input[type="password"]').type('password123')
    cy.get('button[type="submit"]').click()
    cy.wait('@graphqlRequest')

    // Search in table
    cy.get('input[placeholder="Search..."]').type('TEST-001')
    cy.contains('TEST-001').should('be.visible')
  })
})



