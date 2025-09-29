'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAnalytics } from '@/hooks/useAnalytics';
import { Header } from '@/components/Header';
import { LoginForm } from '@/components/forms/LoginForm';
import { formatCurrency, formatNumber, formatDate } from '@/utils/formatters';
import { 
  Search,
  Filter,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Grid3X3,
  List,
  Download,
  Upload,
  Star,
  ShoppingCart
} from 'lucide-react';

interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  price: number;
  cost: number;
  stock: number;
  reserved: number;
  available: number;
  reorderLevel: number;
  supplier: string;
  image: string;
  status: 'active' | 'inactive' | 'discontinued';
  lastUpdated: string;
  createdAt: string;
}

// Mock data for demonstration
const mockProducts: Product[] = [
  {
    id: '1',
    sku: 'LAPTOP-001',
    name: 'MacBook Pro 16" M3',
    description: 'Latest MacBook Pro with M3 chip, 16GB RAM, 512GB SSD',
    category: 'Electronics',
    brand: 'Apple',
    price: 2499.99,
    cost: 1999.99,
    stock: 25,
    reserved: 3,
    available: 22,
    reorderLevel: 10,
    supplier: 'Apple Inc.',
    image: '/api/placeholder/300/200',
    status: 'active',
    lastUpdated: '2024-01-15T10:30:00Z',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    sku: 'PHONE-002',
    name: 'iPhone 15 Pro',
    description: 'iPhone 15 Pro with titanium design, 128GB storage',
    category: 'Electronics',
    brand: 'Apple',
    price: 999.99,
    cost: 799.99,
    stock: 45,
    reserved: 8,
    available: 37,
    reorderLevel: 15,
    supplier: 'Apple Inc.',
    image: '/api/placeholder/300/200',
    status: 'active',
    lastUpdated: '2024-01-14T15:45:00Z',
    createdAt: '2024-01-02T00:00:00Z'
  },
  {
    id: '3',
    sku: 'HEADPHONES-003',
    name: 'Sony WH-1000XM5',
    description: 'Premium noise-canceling wireless headphones',
    category: 'Audio',
    brand: 'Sony',
    price: 399.99,
    cost: 299.99,
    stock: 8,
    reserved: 2,
    available: 6,
    reorderLevel: 20,
    supplier: 'Sony Electronics',
    image: '/api/placeholder/300/200',
    status: 'active',
    lastUpdated: '2024-01-13T09:20:00Z',
    createdAt: '2024-01-03T00:00:00Z'
  },
  {
    id: '4',
    sku: 'WATCH-004',
    name: 'Apple Watch Series 9',
    description: 'Latest Apple Watch with health monitoring features',
    category: 'Wearables',
    brand: 'Apple',
    price: 429.99,
    cost: 329.99,
    stock: 32,
    reserved: 5,
    available: 27,
    reorderLevel: 12,
    supplier: 'Apple Inc.',
    image: '/api/placeholder/300/200',
    status: 'active',
    lastUpdated: '2024-01-12T14:10:00Z',
    createdAt: '2024-01-04T00:00:00Z'
  },
  {
    id: '5',
    sku: 'TABLET-005',
    name: 'iPad Air 11"',
    description: 'iPad Air with M2 chip, perfect for creativity and productivity',
    category: 'Electronics',
    brand: 'Apple',
    price: 599.99,
    cost: 479.99,
    stock: 18,
    reserved: 1,
    available: 17,
    reorderLevel: 8,
    supplier: 'Apple Inc.',
    image: '/api/placeholder/300/200',
    status: 'active',
    lastUpdated: '2024-01-11T11:30:00Z',
    createdAt: '2024-01-05T00:00:00Z'
  },
  {
    id: '6',
    sku: 'SPEAKER-006',
    name: 'HomePod mini',
    description: 'Compact smart speaker with amazing sound',
    category: 'Audio',
    brand: 'Apple',
    price: 99.99,
    cost: 69.99,
    stock: 3,
    reserved: 0,
    available: 3,
    reorderLevel: 25,
    supplier: 'Apple Inc.',
    image: '/api/placeholder/300/200',
    status: 'active',
    lastUpdated: '2024-01-10T16:45:00Z',
    createdAt: '2024-01-06T00:00:00Z'
  }
];

export default function InventoryPage() {
  const { isAuthenticated } = useAuth();
  const [products] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [sortBy, setSortBy] = useState('name');

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.brand.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return b.price - a.price;
        case 'stock':
          return b.stock - a.stock;
        case 'updated':
          return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
        default:
          return 0;
      }
    });

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  // Calculate summary stats
  const totalProducts = products.length;
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
  const lowStockItems = products.filter(p => p.stock <= p.reorderLevel).length;
  const outOfStockItems = products.filter(p => p.stock === 0).length;

  const getStockStatus = (product: Product) => {
    if (product.stock === 0) return { status: 'out-of-stock', color: 'text-red-600 bg-red-50', label: 'Out of Stock' };
    if (product.stock <= product.reorderLevel) return { status: 'low-stock', color: 'text-orange-600 bg-orange-50', label: 'Low Stock' };
    return { status: 'in-stock', color: 'text-green-600 bg-green-50', label: 'In Stock' };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="p-6 lg:p-8">
        <div className="mb-8">

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Products</p>
                  <p className="text-3xl font-bold text-gray-900">{formatNumber(totalProducts)}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Value</p>
                  <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalValue)}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Low Stock Items</p>
                  <p className="text-3xl font-bold text-orange-600">{formatNumber(lowStockItems)}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Out of Stock</p>
                  <p className="text-3xl font-bold text-red-600">{formatNumber(outOfStockItems)}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <TrendingDown className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 text-sm text-black py-2.5 w-full sm:w-80 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2.5 text-sm text-black border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2.5 text-sm text-black border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="name">Sort by Name</option>
                <option value="price">Sort by Price</option>
                <option value="stock">Sort by Stock</option>
                <option value="updated">Sort by Updated</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 rounded-lg transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-purple-100 text-purple-600' 
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 rounded-lg transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-purple-100 text-purple-600' 
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const stockStatus = getStockStatus(product);
              return (
                <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
                  {/* Product Image */}
                  <div className="relative h-48 bg-gray-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <button className="p-2 bg-white rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                    <div className="absolute top-3 left-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${stockStatus.color}`}>
                        {stockStatus.label}
                      </span>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <div className="mb-3">
                      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
                      <p className="text-sm text-gray-500 mb-2">{product.sku}</p>
                      <p className="text-xs text-gray-400 line-clamp-2">{product.description}</p>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-lg font-bold text-gray-900">{formatCurrency(product.price)}</p>
                        <p className="text-sm text-gray-500">Cost: {formatCurrency(product.cost)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{product.stock} units</p>
                        <p className="text-xs text-gray-500">{product.available} available</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{product.brand}</span>
                      <div className="flex items-center space-x-2">
                        <button className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredProducts.map((product) => {
                    const stockStatus = getStockStatus(product);
                    return (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-12 h-12 rounded-lg object-cover mr-4"
                            />
                            <div>
                              <p className="font-medium text-gray-900">{product.name}</p>
                              <p className="text-sm text-gray-500">{product.brand}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{product.sku}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{product.category}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{formatCurrency(product.price)}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{product.stock} units</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${stockStatus.color}`}>
                            {stockStatus.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria</p>
            <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors mx-auto">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Product
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
