'use client';

import { useAuth } from '@/hooks/useAuth';
import { useAnalytics } from '@/hooks/useAnalytics';
import { SalesChart } from '@/components/charts/SalesChart';
import { CustomerChart } from '@/components/charts/CustomerChart';
import { InventoryChart } from '@/components/charts/InventoryChart';
import { DataTable, Column } from '@/components/tables/DataTable';
import { formatCurrency, formatNumber, formatDate } from '@/utils/formatters';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Package, 
  DollarSign, 
  ShoppingCart,
  Activity
} from 'lucide-react';
import { LoginForm } from '@/components/forms/LoginForm';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';

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

export default function Dashboard() {
  const { isAuthenticated } = useAuth();
  const { analytics, loading, error } = useAnalytics();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            {/* <X className="w-8 h-8 text-red-600" /> */}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            {/* <BarChart3 className="w-8 h-8 text-gray-400" /> */}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Data Available</h2>
          <p className="text-gray-600">Please check back later.</p>
        </div>
      </div>
    );
  }

  // Define columns for inventory table
  const inventoryColumns: Column<InventoryItem>[] = [
    {
      key: 'sku',
      header: 'SKU',
      sortable: true,
      filterable: true,
    },
    {
      key: 'name',
      header: 'Product Name',
      sortable: true,
      filterable: true,
    },
    {
      key: 'category',
      header: 'Category',
      sortable: true,
      filterable: true,
    },
    {
      key: 'stock',
      header: 'Stock',
      sortable: true,
      render: (value, row) => (
        <span className={`font-medium ${value < 10 ? 'text-red-600' : 'text-green-600'}`}>
          {formatNumber(value)}
        </span>
      ),
    },
    {
      key: 'price',
      header: 'Price',
      sortable: true,
      render: (value) => formatCurrency(value),
    },
    {
      key: 'lastUpdated',
      header: 'Last Updated',
      sortable: true,
      render: (value) => formatDate(value),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Use existing Sidebar component */}
      {/* <Sidebar /> */}

      {/* Main Content */}
      <div className="w-full">
        {/* Use Header Component */}

        {/* Dashboard Content */}
        <div className="p-6 lg:p-8">

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Revenue</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {formatCurrency(analytics.totalRevenue)}
                  </p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600 font-medium">+12.5%</span>
                    <span className="text-sm text-gray-500 ml-1">vs last month</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Orders</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {formatNumber(analytics.totalOrders)}
                  </p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-blue-500 mr-1" />
                    <span className="text-sm text-blue-600 font-medium">+8.2%</span>
                    <span className="text-sm text-gray-500 ml-1">vs last month</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Customers</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {formatNumber(analytics.customerMetrics.totalCustomers)}
                  </p>
                  <div className="flex items-center mt-2">
                    {analytics.customerMetrics.growthRate > 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${
                      analytics.customerMetrics.growthRate > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {analytics.customerMetrics.growthRate > 0 ? '+' : ''}{analytics.customerMetrics.growthRate.toFixed(1)}%
                    </span>
                    <span className="text-sm text-gray-500 ml-1">vs last month</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Avg Order Value</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {formatCurrency(analytics.averageOrderValue)}
                  </p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-orange-500 mr-1" />
                    <span className="text-sm text-orange-600 font-medium">+5.4%</span>
                    <span className="text-sm text-gray-500 ml-1">vs last month</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Sales Overview</h3>
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Live data</span>
                </div>
              </div>
              <SalesChart data={analytics.salesData} />
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Customer Growth</h3>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600">Growing</span>
                </div>
              </div>
              <CustomerChart data={analytics.customerMetrics} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Inventory Status</h3>
                <div className="flex items-center space-x-2">
                  <Package className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Real-time</span>
                </div>
              </div>
              <InventoryChart data={analytics.inventoryStatus} />
            </div>
          </div>

          {/* Inventory Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Inventory Overview</h3>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    View All
                  </button>
                </div>
              </div>
            </div>
            <div className="p-6">
              <DataTable
                data={analytics.inventoryStatus}
                columns={inventoryColumns}
                searchable={true}
                filterable={true}
                pagination={true}
                pageSize={10}
              />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}