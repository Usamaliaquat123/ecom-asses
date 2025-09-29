'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
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
  Users,
  UserPlus,
  TrendingUp,
  TrendingDown,
  Grid3X3,
  List,
  Download,
  Upload,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Star,
  ShoppingBag,
  CreditCard,
  Activity,
  Award,
  Clock
} from 'lucide-react';

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  status: 'active' | 'inactive' | 'blocked';
  customerType: 'regular' | 'premium' | 'vip';
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  lastOrderDate: string;
  joinDate: string;
  lastActivity: string;
  loyaltyPoints: number;
  tags: string[];
}

// Mock data for demonstration
const mockCustomers: Customer[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    avatar: '/api/placeholder/100/100',
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    status: 'active',
    customerType: 'premium',
    totalOrders: 24,
    totalSpent: 5420.50,
    averageOrderValue: 225.85,
    lastOrderDate: '2024-01-15T10:30:00Z',
    joinDate: '2023-03-15T00:00:00Z',
    lastActivity: '2024-01-16T14:22:00Z',
    loyaltyPoints: 1250,
    tags: ['frequent-buyer', 'tech-enthusiast']
  },
  {
    id: '2',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@example.com',
    phone: '+1 (555) 987-6543',
    avatar: '/api/placeholder/100/100',
    address: {
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'USA'
    },
    status: 'active',
    customerType: 'vip',
    totalOrders: 45,
    totalSpent: 12850.75,
    averageOrderValue: 285.57,
    lastOrderDate: '2024-01-14T16:45:00Z',
    joinDate: '2022-08-20T00:00:00Z',
    lastActivity: '2024-01-16T09:15:00Z',
    loyaltyPoints: 2890,
    tags: ['vip', 'fashion-lover', 'early-adopter']
  },
  {
    id: '3',
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'michael.chen@example.com',
    phone: '+1 (555) 456-7890',
    avatar: '/api/placeholder/100/100',
    address: {
      street: '789 Pine St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      country: 'USA'
    },
    status: 'active',
    customerType: 'regular',
    totalOrders: 8,
    totalSpent: 1240.25,
    averageOrderValue: 155.03,
    lastOrderDate: '2024-01-12T11:20:00Z',
    joinDate: '2023-11-10T00:00:00Z',
    lastActivity: '2024-01-15T18:30:00Z',
    loyaltyPoints: 320,
    tags: ['new-customer', 'mobile-user']
  },
  {
    id: '4',
    firstName: 'Emily',
    lastName: 'Davis',
    email: 'emily.davis@example.com',
    phone: '+1 (555) 321-0987',
    avatar: '/api/placeholder/100/100',
    address: {
      street: '321 Elm St',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA'
    },
    status: 'inactive',
    customerType: 'regular',
    totalOrders: 15,
    totalSpent: 2180.90,
    averageOrderValue: 145.39,
    lastOrderDate: '2023-12-05T14:15:00Z',
    joinDate: '2023-05-22T00:00:00Z',
    lastActivity: '2023-12-20T10:45:00Z',
    loyaltyPoints: 580,
    tags: ['inactive', 'seasonal-buyer']
  },
  {
    id: '5',
    firstName: 'David',
    lastName: 'Wilson',
    email: 'david.wilson@example.com',
    phone: '+1 (555) 654-3210',
    avatar: '/api/placeholder/100/100',
    address: {
      street: '654 Maple Dr',
      city: 'Miami',
      state: 'FL',
      zipCode: '33101',
      country: 'USA'
    },
    status: 'active',
    customerType: 'premium',
    totalOrders: 32,
    totalSpent: 7650.40,
    averageOrderValue: 239.08,
    lastOrderDate: '2024-01-13T13:25:00Z',
    joinDate: '2022-12-08T00:00:00Z',
    lastActivity: '2024-01-16T12:10:00Z',
    loyaltyPoints: 1890,
    tags: ['loyal-customer', 'bulk-buyer']
  },
  {
    id: '6',
    firstName: 'Lisa',
    lastName: 'Anderson',
    email: 'lisa.anderson@example.com',
    phone: '+1 (555) 789-0123',
    avatar: '/api/placeholder/100/100',
    address: {
      street: '987 Cedar Ln',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98101',
      country: 'USA'
    },
    status: 'blocked',
    customerType: 'regular',
    totalOrders: 3,
    totalSpent: 285.50,
    averageOrderValue: 95.17,
    lastOrderDate: '2023-10-15T09:30:00Z',
    joinDate: '2023-09-12T00:00:00Z',
    lastActivity: '2023-11-02T16:20:00Z',
    loyaltyPoints: 0,
    tags: ['blocked', 'payment-issues']
  }
];

export default function CustomersPage() {
  const { isAuthenticated } = useAuth();
  const [customers] = useState<Customer[]>(mockCustomers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [sortBy, setSortBy] = useState('name');

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  // Filter and sort customers
  const filteredCustomers = customers
    .filter(customer => {
      const matchesSearch = 
        customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm);
      const matchesStatus = selectedStatus === 'all' || customer.status === selectedStatus;
      const matchesType = selectedType === 'all' || customer.customerType === selectedType;
      return matchesSearch && matchesStatus && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
        case 'spent':
          return b.totalSpent - a.totalSpent;
        case 'orders':
          return b.totalOrders - a.totalOrders;
        case 'joined':
          return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime();
        default:
          return 0;
      }
    });

  // Calculate summary stats
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === 'active').length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const averageOrderValue = customers.reduce((sum, c) => sum + c.averageOrderValue, 0) / customers.length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'inactive':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'blocked':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'vip':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'premium':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'regular':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
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
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Customers</p>
                  <p className="text-3xl font-bold text-gray-900">{formatNumber(totalCustomers)}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600 font-medium">+12.5%</span>
                    <span className="text-sm text-gray-500 ml-1">vs last month</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Active Customers</p>
                  <p className="text-3xl font-bold text-gray-900">{formatNumber(activeCustomers)}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600 font-medium">+8.2%</span>
                    <span className="text-sm text-gray-500 ml-1">vs last month</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Activity className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Revenue</p>
                  <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600 font-medium">+15.3%</span>
                    <span className="text-sm text-gray-500 ml-1">vs last month</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Avg Order Value</p>
                  <p className="text-3xl font-bold text-gray-900">{formatCurrency(averageOrderValue)}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600 font-medium">+5.7%</span>
                    <span className="text-sm text-gray-500 ml-1">vs last month</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-orange-600" />
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
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 text-sm text-black py-2.5 w-full sm:w-80 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2.5 text-sm text-black border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="blocked">Blocked</option>
              </select>

              {/* Type Filter */}
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-2.5 text-sm text-black border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="regular">Regular</option>
                <option value="premium">Premium</option>
                <option value="vip">VIP</option>
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2.5 text-sm text-black border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="name">Sort by Name</option>
                <option value="spent">Sort by Spent</option>
                <option value="orders">Sort by Orders</option>
                <option value="joined">Sort by Join Date</option>
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

        {/* Customers Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCustomers.map((customer) => (
              <div key={customer.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
                {/* Customer Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-white">
                            {getInitials(customer.firstName, customer.lastName)}
                          </span>
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                          customer.status === 'active' ? 'bg-green-500' : 
                          customer.status === 'inactive' ? 'bg-orange-500' : 'bg-red-500'
                        }`}></div>
                      </div>
                      <div className="ml-3">
                        <h3 className="font-semibold text-gray-900">{customer.firstName} {customer.lastName}</h3>
                        <p className="text-sm text-gray-500">{customer.email}</p>
                      </div>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Status and Type Badges */}
                  <div className="flex items-center space-x-2 mb-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(customer.status)}`}>
                      {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getTypeColor(customer.customerType)}`}>
                      {customer.customerType.toUpperCase()}
                    </span>
                  </div>

                  {/* Customer Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Total Orders</p>
                      <p className="text-lg font-bold text-gray-900">{customer.totalOrders}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Total Spent</p>
                      <p className="text-lg font-bold text-gray-900">{formatCurrency(customer.totalSpent)}</p>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-4 h-4 mr-2 text-gray-400" />
                      {customer.phone}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                      {customer.address.city}, {customer.address.state}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      Joined {formatDate(customer.joinDate)}
                    </div>
                  </div>

                  {/* Loyalty Points */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Award className="w-4 h-4 text-yellow-500 mr-2" />
                      <span className="text-sm text-gray-600">{customer.loyaltyPoints} points</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-gray-400 mr-1" />
                      <span className="text-xs text-gray-500">
                        {formatDate(customer.lastActivity)}
                      </span>
                    </div>
                  </div>

                  {/* Tags */}
                  {customer.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {customer.tags.slice(0, 2).map((tag, index) => (
                        <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                          {tag}
                        </span>
                      ))}
                      {customer.tags.length > 2 && (
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                          +{customer.tags.length - 2}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                 
                      <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                        <Mail className="w-4 h-4" />
                      </button>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spent</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Order</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="relative mr-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center">
                              <span className="text-sm font-semibold text-white">
                                {getInitials(customer.firstName, customer.lastName)}
                              </span>
                            </div>
                            <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                              customer.status === 'active' ? 'bg-green-500' : 
                              customer.status === 'inactive' ? 'bg-orange-500' : 'bg-red-500'
                            }`}></div>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{customer.firstName} {customer.lastName}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getTypeColor(customer.customerType)}`}>
                                {customer.customerType.toUpperCase()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm text-gray-900">{customer.email}</p>
                          <p className="text-sm text-gray-500">{customer.phone}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(customer.status)}`}>
                          {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{customer.totalOrders}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{formatCurrency(customer.totalSpent)}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{formatDate(customer.lastOrderDate)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
               
                          <button className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                            <Mail className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredCustomers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria</p>
            <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors mx-auto">
              <UserPlus className="w-4 h-4 mr-2" />
              Add Your First Customer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
