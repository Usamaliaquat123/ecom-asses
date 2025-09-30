import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import Dashboard from '@/app/page'
import authSlice from '@/lib/features/auth/authSlice'
import dashboardSlice from '@/lib/features/dashboard/dashboardSlice'

// Mock the hooks
jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    isAuthenticated: true,
    user: {
      id: '1',
      email: 'test@example.com',
      role: 'USER',
      profile: {
        firstName: 'Test',
        lastName: 'User',
      },
    },
  }),
}))

jest.mock('@/hooks/useAnalytics', () => ({
  useAnalytics: () => ({
    analytics: {
      totalRevenue: 100000,
      totalOrders: 500,
      averageOrderValue: 200,
      salesData: [],
      customerMetrics: {
        totalCustomers: 1000,
        newCustomers: 100,
        returningCustomers: 900,
        averageOrderValue: 200,
        growthRate: 5.5,
      },
      inventoryStatus: [],
    },
    loading: false,
    error: null,
  }),
}))

const mockStore = configureStore({
  reducer: {
    auth: authSlice,
    dashboard: dashboardSlice,
  },
})

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <Provider store={mockStore}>
      {component}
    </Provider>
  )
}

describe('Dashboard', () => {
  it('renders dashboard title', () => {
    renderWithProvider(<Dashboard />)
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })

  it('displays key metrics', () => {
    renderWithProvider(<Dashboard />)
    expect(screen.getByText('Total Revenue')).toBeInTheDocument()
    expect(screen.getByText('Total Orders')).toBeInTheDocument()
    expect(screen.getByText('Total Customers')).toBeInTheDocument()
    expect(screen.getByText('Avg Order Value')).toBeInTheDocument()
  })

  it('shows formatted currency values', () => {
    renderWithProvider(<Dashboard />)
    expect(screen.getByText('$100,000.00')).toBeInTheDocument()
    expect(screen.getByText('$200.00')).toBeInTheDocument()
  })

  it('displays customer growth rate', () => {
    renderWithProvider(<Dashboard />)
    expect(screen.getByText('5.5%')).toBeInTheDocument()
  })
})



