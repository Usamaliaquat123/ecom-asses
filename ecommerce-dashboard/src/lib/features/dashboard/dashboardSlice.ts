import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SalesMetric {
  id: string;
  date: string;
  revenue: number;
  orders: number;
  customers: number;
  channel: string;
}

interface CustomerMetrics {
  totalCustomers: number;
  newCustomers: number;
  returningCustomers: number;
  averageOrderValue: number;
  growthRate: number;
}

interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  stock: number;
  reserved: number;
  price: number;
  cost: number;
  supplier?: string;
  lastUpdated: string;
}

interface Analytics {
  salesData: SalesMetric[];
  customerMetrics: CustomerMetrics;
  inventoryStatus: InventoryItem[];
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
}

interface DashboardState {
  analytics: Analytics | null;
  selectedDateRange: {
    startDate: string;
    endDate: string;
  };
  loading: boolean;
  error: string | null;
  filters: {
    channel?: string;
    category?: string;
    lowStock?: boolean;
  };
}

const initialState: DashboardState = {
  analytics: null,
  selectedDateRange: {
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    endDate: new Date().toISOString(),
  },
  loading: false,
  error: null,
  filters: {},
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setAnalytics: (state, action: PayloadAction<Analytics>) => {
      state.analytics = action.payload;
      state.loading = false;
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setDateRange: (state, action: PayloadAction<{ startDate: string; endDate: string }>) => {
      state.selectedDateRange = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<DashboardState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
    updateSalesMetric: (state, action: PayloadAction<SalesMetric>) => {
      if (state.analytics) {
        const index = state.analytics.salesData.findIndex(
          (metric) => metric.id === action.payload.id
        );
        if (index !== -1) {
          state.analytics.salesData[index] = action.payload;
        } else {
          state.analytics.salesData.push(action.payload);
        }
      }
    },
    updateInventoryItem: (state, action: PayloadAction<InventoryItem>) => {
      if (state.analytics) {
        const index = state.analytics.inventoryStatus.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.analytics.inventoryStatus[index] = action.payload;
        }
      }
    },
  },
});

export const {
  setLoading,
  setAnalytics,
  setError,
  setDateRange,
  setFilters,
  clearError,
  updateSalesMetric,
  updateInventoryItem,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
