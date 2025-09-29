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
  Download,
  Eye,
  FileText,
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  Grid3X3,
  List,
  Calendar,
  Clock,
  Users,
  ShoppingBag,
  DollarSign,
  Package,
  Activity,
  Share2,
  Mail,
  Printer,
  RefreshCw,
  Star,
  AlertCircle,
  CheckCircle,
  XCircle,
  PlayCircle,
  PauseCircle,
  Settings
} from 'lucide-react';

interface Report {
  id: string;
  name: string;
  description: string;
  type: 'sales' | 'customers' | 'inventory' | 'financial' | 'marketing' | 'operations';
  category: 'standard' | 'custom' | 'scheduled';
  status: 'ready' | 'generating' | 'failed' | 'scheduled';
  lastGenerated: string;
  nextScheduled?: string;
  frequency?: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  size: string;
  format: 'pdf' | 'excel' | 'csv' | 'json';
  createdBy: string;
  createdAt: string;
  downloadCount: number;
  isStarred: boolean;
  tags: string[];
  metrics: {
    totalRecords: number;
    dateRange: string;
    keyInsight: string;
  };
}

// Mock data for demonstration
const mockReports: Report[] = [
  {
    id: '1',
    name: 'Monthly Sales Report',
    description: 'Comprehensive sales analysis with revenue trends, top products, and performance metrics',
    type: 'sales',
    category: 'scheduled',
    status: 'ready',
    lastGenerated: '2024-01-16T08:00:00Z',
    nextScheduled: '2024-02-01T08:00:00Z',
    frequency: 'monthly',
    size: '2.4 MB',
    format: 'pdf',
    createdBy: 'John Admin',
    createdAt: '2023-12-01T00:00:00Z',
    downloadCount: 45,
    isStarred: true,
    tags: ['revenue', 'trends', 'monthly'],
    metrics: {
      totalRecords: 1250,
      dateRange: 'Jan 1-31, 2024',
      keyInsight: 'Revenue increased by 15.3%'
    }
  },
  {
    id: '2',
    name: 'Customer Segmentation Analysis',
    description: 'Detailed customer behavior analysis with segmentation and lifetime value calculations',
    type: 'customers',
    category: 'custom',
    status: 'ready',
    lastGenerated: '2024-01-15T14:30:00Z',
    size: '1.8 MB',
    format: 'excel',
    createdBy: 'Sarah Manager',
    createdAt: '2024-01-10T00:00:00Z',
    downloadCount: 23,
    isStarred: false,
    tags: ['segmentation', 'behavior', 'ltv'],
    metrics: {
      totalRecords: 2840,
      dateRange: 'Last 6 months',
      keyInsight: 'VIP customers drive 40% of revenue'
    }
  },
  {
    id: '3',
    name: 'Inventory Stock Report',
    description: 'Current stock levels, low stock alerts, and reorder recommendations',
    type: 'inventory',
    category: 'standard',
    status: 'generating',
    lastGenerated: '2024-01-14T10:15:00Z',
    size: '950 KB',
    format: 'csv',
    createdBy: 'Mike Inventory',
    createdAt: '2024-01-01T00:00:00Z',
    downloadCount: 67,
    isStarred: true,
    tags: ['stock', 'alerts', 'reorder'],
    metrics: {
      totalRecords: 456,
      dateRange: 'Current',
      keyInsight: '23 items need reordering'
    }
  },
  {
    id: '4',
    name: 'Financial Performance Dashboard',
    description: 'P&L statement, cash flow analysis, and key financial ratios',
    type: 'financial',
    category: 'scheduled',
    status: 'ready',
    lastGenerated: '2024-01-15T18:00:00Z',
    nextScheduled: '2024-01-22T18:00:00Z',
    frequency: 'weekly',
    size: '3.2 MB',
    format: 'pdf',
    createdBy: 'Lisa Finance',
    createdAt: '2023-11-15T00:00:00Z',
    downloadCount: 89,
    isStarred: true,
    tags: ['p&l', 'cashflow', 'ratios'],
    metrics: {
      totalRecords: 890,
      dateRange: 'Q4 2023',
      keyInsight: 'Profit margin improved by 8%'
    }
  },
  {
    id: '5',
    name: 'Marketing Campaign ROI',
    description: 'Campaign performance metrics, conversion rates, and ROI analysis',
    type: 'marketing',
    category: 'custom',
    status: 'failed',
    lastGenerated: '2024-01-13T12:00:00Z',
    size: '1.1 MB',
    format: 'excel',
    createdBy: 'Tom Marketing',
    createdAt: '2024-01-05T00:00:00Z',
    downloadCount: 12,
    isStarred: false,
    tags: ['campaigns', 'roi', 'conversion'],
    metrics: {
      totalRecords: 340,
      dateRange: 'Last 30 days',
      keyInsight: 'Email campaigns show 25% ROI'
    }
  },
  {
    id: '6',
    name: 'Operations Efficiency Report',
    description: 'Order processing times, fulfillment rates, and operational KPIs',
    type: 'operations',
    category: 'standard',
    status: 'scheduled',
    lastGenerated: '2024-01-12T09:30:00Z',
    nextScheduled: '2024-01-19T09:30:00Z',
    frequency: 'weekly',
    size: '1.5 MB',
    format: 'pdf',
    createdBy: 'Alex Operations',
    createdAt: '2023-10-20T00:00:00Z',
    downloadCount: 34,
    isStarred: false,
    tags: ['efficiency', 'fulfillment', 'kpis'],
    metrics: {
      totalRecords: 1680,
      dateRange: 'Last 7 days',
      keyInsight: 'Avg processing time: 2.3 hours'
    }
  }
];

export default function ReportsPage() {
  const { isAuthenticated } = useAuth();
  const [reports] = useState<Report[]>(mockReports);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [sortBy, setSortBy] = useState('name');

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  // Filter and sort reports
  const filteredReports = reports
    .filter(report => {
      const matchesSearch = 
        report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesType = selectedType === 'all' || report.type === selectedType;
      const matchesCategory = selectedCategory === 'all' || report.category === selectedCategory;
      const matchesStatus = selectedStatus === 'all' || report.status === selectedStatus;
      return matchesSearch && matchesType && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'lastGenerated':
          return new Date(b.lastGenerated).getTime() - new Date(a.lastGenerated).getTime();
        case 'downloads':
          return b.downloadCount - a.downloadCount;
        case 'size':
          return parseFloat(b.size) - parseFloat(a.size);
        default:
          return 0;
      }
    });

  // Calculate summary stats
  const totalReports = reports.length;
  const readyReports = reports.filter(r => r.status === 'ready').length;
  const scheduledReports = reports.filter(r => r.category === 'scheduled').length;
  const totalDownloads = reports.reduce((sum, r) => sum + r.downloadCount, 0);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'sales':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'customers':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'inventory':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'financial':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'marketing':
        return 'text-pink-600 bg-pink-50 border-pink-200';
      case 'operations':
        return 'text-indigo-600 bg-indigo-50 border-indigo-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'generating':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'failed':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'scheduled':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready':
        return <CheckCircle className="w-4 h-4" />;
      case 'generating':
        return <RefreshCw className="w-4 h-4 animate-spin" />;
      case 'failed':
        return <XCircle className="w-4 h-4" />;
      case 'scheduled':
        return <Clock className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'sales':
        return <TrendingUp className="w-5 h-5" />;
      case 'customers':
        return <Users className="w-5 h-5" />;
      case 'inventory':
        return <Package className="w-5 h-5" />;
      case 'financial':
        return <DollarSign className="w-5 h-5" />;
      case 'marketing':
        return <BarChart3 className="w-5 h-5" />;
      case 'operations':
        return <Activity className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
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
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Reports</p>
                  <p className="text-3xl font-bold text-gray-900">{formatNumber(totalReports)}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600 font-medium">+6 this month</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Ready Reports</p>
                  <p className="text-3xl font-bold text-gray-900">{formatNumber(readyReports)}</p>
                  <div className="flex items-center mt-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600 font-medium">Available now</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Scheduled Reports</p>
                  <p className="text-3xl font-bold text-gray-900">{formatNumber(scheduledReports)}</p>
                  <div className="flex items-center mt-2">
                    <Clock className="w-4 h-4 text-orange-500 mr-1" />
                    <span className="text-sm text-orange-600 font-medium">Auto-generated</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Downloads</p>
                  <p className="text-3xl font-bold text-gray-900">{formatNumber(totalDownloads)}</p>
                  <div className="flex items-center mt-2">
                    <Download className="w-4 h-4 text-purple-500 mr-1" />
                    <span className="text-sm text-purple-600 font-medium">This month</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Download className="w-6 h-6 text-purple-600" />
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
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 text-sm text-black py-2.5 w-full sm:w-80 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Type Filter */}
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-2.5 text-sm text-black border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="sales">Sales</option>
                <option value="customers">Customers</option>
                <option value="inventory">Inventory</option>
                <option value="financial">Financial</option>
                <option value="marketing">Marketing</option>
                <option value="operations">Operations</option>
              </select>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2.5 text-sm text-black border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="standard">Standard</option>
                <option value="custom">Custom</option>
                <option value="scheduled">Scheduled</option>
              </select>

              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2.5 text-sm text-black border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="ready">Ready</option>
                <option value="generating">Generating</option>
                <option value="failed">Failed</option>
                <option value="scheduled">Scheduled</option>
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2.5 text-sm text-black border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="name">Sort by Name</option>
                <option value="lastGenerated">Sort by Date</option>
                <option value="downloads">Sort by Downloads</option>
                <option value="size">Sort by Size</option>
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

        {/* Reports Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report) => (
              <div key={report.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
                {/* Report Header */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getTypeColor(report.type).replace('text-', 'text-').replace('border-', 'bg-')}`}>
                        {getTypeIcon(report.type)}
                      </div>
                      <div className="ml-3">
                        <div className="flex items-center">
                          <h3 className="font-semibold text-gray-900 mr-2">{report.name}</h3>
                          {report.isStarred && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{report.createdBy}</p>
                      </div>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{report.description}</p>

                  {/* Status and Type Badges */}
                  <div className="flex items-center space-x-2 mb-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border flex items-center ${getStatusColor(report.status)}`}>
                      {getStatusIcon(report.status)}
                      <span className="ml-1">{report.status.charAt(0).toUpperCase() + report.status.slice(1)}</span>
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getTypeColor(report.type)}`}>
                      {report.type.toUpperCase()}
                    </span>
                    <span className="px-2 py-1 text-xs font-medium rounded-full border text-gray-600 bg-gray-50 border-gray-200">
                      {report.format.toUpperCase()}
                    </span>
                  </div>

                  {/* Report Metrics */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Records</p>
                        <p className="text-sm font-semibold text-gray-900">{formatNumber(report.metrics.totalRecords)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Size</p>
                        <p className="text-sm font-semibold text-gray-900">{report.size}</p>
                      </div>
                    </div>
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-1">Date Range</p>
                      <p className="text-sm font-semibold text-gray-900">{report.metrics.dateRange}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Key Insight</p>
                      <p className="text-sm font-semibold text-purple-600">{report.metrics.keyInsight}</p>
                    </div>
                  </div>

                  {/* Report Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Last Generated:</span>
                      <span className="text-gray-900">{formatDate(report.lastGenerated)}</span>
                    </div>
                    {report.nextScheduled && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Next Scheduled:</span>
                        <span className="text-gray-900">{formatDate(report.nextScheduled)}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Downloads:</span>
                      <span className="text-gray-900">{report.downloadCount}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  {report.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {report.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                          {tag}
                        </span>
                      ))}
                      {report.tags.length > 3 && (
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                          +{report.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      <button 
                        className={`p-2 rounded-lg transition-colors ${
                          report.status === 'ready' 
                            ? 'text-gray-400 hover:text-purple-600 hover:bg-purple-50' 
                            : 'text-gray-300 cursor-not-allowed'
                        }`}
                        disabled={report.status !== 'ready'}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        className={`p-2 rounded-lg transition-colors ${
                          report.status === 'ready' 
                            ? 'text-gray-400 hover:text-green-600 hover:bg-green-50' 
                            : 'text-gray-300 cursor-not-allowed'
                        }`}
                        disabled={report.status !== 'ready'}
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center space-x-2">
                      {report.frequency && (
                        <button className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                          {report.status === 'scheduled' ? <PauseCircle className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
                        </button>
                      )}
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                        <Settings className="w-4 h-4" />
                      </button>
                    </div>
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
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Generated</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Downloads</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredReports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 ${getTypeColor(report.type).replace('text-', 'text-').replace('border-', 'bg-')}`}>
                            {getTypeIcon(report.type)}
                          </div>
                          <div>
                            <div className="flex items-center">
                              <p className="font-medium text-gray-900 mr-2">{report.name}</p>
                              {report.isStarred && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                            </div>
                            <p className="text-sm text-gray-500">{report.createdBy}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getTypeColor(report.type)}`}>
                          {report.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border flex items-center w-fit ${getStatusColor(report.status)}`}>
                          {getStatusIcon(report.status)}
                          <span className="ml-1">{report.status.charAt(0).toUpperCase() + report.status.slice(1)}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{formatDate(report.lastGenerated)}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{report.size}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{report.downloadCount}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button 
                            className={`p-1.5 rounded-lg transition-colors ${
                              report.status === 'ready' 
                                ? 'text-gray-400 hover:text-purple-600 hover:bg-purple-50' 
                                : 'text-gray-300 cursor-not-allowed'
                            }`}
                            disabled={report.status !== 'ready'}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            className={`p-1.5 rounded-lg transition-colors ${
                              report.status === 'ready' 
                                ? 'text-gray-400 hover:text-green-600 hover:bg-green-50' 
                                : 'text-gray-300 cursor-not-allowed'
                            }`}
                            disabled={report.status !== 'ready'}
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Share2 className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                            <Settings className="w-4 h-4" />
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
        {filteredReports.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria</p>
            <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors mx-auto">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Report
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
