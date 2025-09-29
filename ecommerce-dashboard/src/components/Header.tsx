'use client';

import { 
  Bell, 
  Search, 
  RefreshCw, 
  Settings,
  HelpCircle,
  ChevronDown,
  User,
  LogOut,
  BarChart3,
  Filter,
  Download,
  Plus,
  Upload,
  Calendar,
  UserPlus,
  Package,
  FileText,
  Users
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAnalytics } from '@/hooks/useAnalytics';
import { usePathname } from 'next/navigation';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  icon?: React.ComponentType<any>;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  actions?: Array<{
    label: string;
    icon: React.ComponentType<any>;
    onClick?: () => void;
    variant?: 'primary' | 'secondary';
  }>;
  showSecondaryBar?: boolean;
}

export function Header({ 
  title, 
  subtitle, 
  icon: IconComponent, 
  breadcrumbs, 
  actions = [], 
  showSecondaryBar = true 
}: HeaderProps = {}) {
  const { user, logout } = useAuth();
  const { refreshData, loading } = useAnalytics();
  const pathname = usePathname();

  // Default page configurations
  const getPageConfig = () => {
    switch (pathname) {
      case '/':
        return {
          title: 'Analytics Dashboard',
          subtitle: 'Real-time business insights',
          icon: BarChart3,
          breadcrumbs: [{ label: 'Dashboard' }, { label: 'Overview' }],
          actions: []
        };
      case '/inventory':
        return {
          title: 'Inventory Management',
          subtitle: 'Manage your product catalog and stock levels',
          icon: Package,
          breadcrumbs: [{ label: 'Dashboard' }, { label: 'Inventory' }],
          actions: [
            { label: 'Import', icon: Upload, variant: 'secondary' as const },
            { label: 'Export', icon: Download, variant: 'secondary' as const },
            { label: 'Add Product', icon: Plus, variant: 'primary' as const }
          ]
        };
      case '/customers':
        return {
          title: 'Customer Management',
          subtitle: 'Manage your customer relationships and analytics',
          icon: Users,
          breadcrumbs: [{ label: 'Dashboard' }, { label: 'Customers' }],
          actions: [
            { label: 'Import', icon: Upload, variant: 'secondary' as const },
            { label: 'Export', icon: Download, variant: 'secondary' as const },
            { label: 'Add Customer', icon: UserPlus, variant: 'primary' as const }
          ]
        };
      case '/reports':
        return {
          title: 'Reports & Analytics',
          subtitle: 'Generate, schedule, and manage your business reports',
          icon: FileText,
          breadcrumbs: [{ label: 'Dashboard' }, { label: 'Reports' }],
          actions: [
            { label: 'Templates', icon: Settings, variant: 'secondary' as const },
            { label: 'Schedule', icon: Calendar, variant: 'secondary' as const },
            { label: 'New Report', icon: Plus, variant: 'primary' as const }
          ]
        };
      case '/settings':
        return {
          title: 'Settings',
          subtitle: 'Manage your account and application preferences',
          icon: Settings,
          breadcrumbs: [{ label: 'Dashboard' }, { label: 'Settings' }],
          actions: [],
          showSecondaryBar: false
        };
      default:
        return {
          title: 'Analytics Dashboard',
          subtitle: 'Real-time business insights',
          icon: BarChart3,
          breadcrumbs: [{ label: 'Dashboard' }, { label: 'Overview' }],
          actions: []
        };
    }
  };

  const pageConfig = getPageConfig();
  const finalTitle = title || pageConfig.title;
  const finalSubtitle = subtitle || pageConfig.subtitle;
  const FinalIcon  = IconComponent || pageConfig.icon;
  const finalBreadcrumbs = breadcrumbs || pageConfig.breadcrumbs;
  const finalActions = actions.length > 0 ? actions : pageConfig.actions;
  const finalShowSecondaryBar = showSecondaryBar && (pageConfig.showSecondaryBar !== false);

  return (
    <header className="bg-white border-b border-gray-100 shadow-sm">
      <div className="px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left Section - Brand & Navigation */}
          <div className="flex items-center space-x-8">
            {/* Brand Logo */}
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
                <FinalIcon className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <h1 className="text-xl font-bold text-gray-900">{finalTitle}</h1>
                <p className="text-sm text-gray-500">{finalSubtitle}</p>
              </div>
            </div>

            {/* Breadcrumb Navigation */}
            <nav className="hidden md:flex items-center space-x-2 text-sm">
              {finalBreadcrumbs.map((crumb, index) => (
                <div key={index} className="flex items-center space-x-2">
                  {index > 0 && <span className="text-gray-300">/</span>}
                  <span className={index === finalBreadcrumbs.length - 1 ? 'text-purple-600 font-medium' : 'text-gray-400'}>
                    {crumb.label}
                  </span>
                </div>
              ))}
            </nav>
          </div>

          {/* Right Section - Search & Actions */}
          <div className="flex items-center space-x-4">
            {/* Enhanced Search Bar */}
            <div className="relative hidden sm:block">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search analytics, reports..."
                className="w-80 pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white transition-all duration-200"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <kbd className="inline-flex items-center px-2 py-1 border border-gray-200 rounded text-xs font-sans font-medium text-gray-400">
                  ⌘K
                </kbd>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              {/* Help Button */}
              <button className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors duration-200">
                <HelpCircle className="w-5 h-5" />
              </button>

              {/* Notifications */}
              <button className="relative p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors duration-200">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Settings */}
              <button className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors duration-200">
                <Settings className="w-5 h-5" />
              </button>

              {/* Divider */}
              <div className="w-px h-6 bg-gray-200 mx-2"></div>

              {/* User Profile Dropdown */}
              <div className="relative">
                <button className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50 transition-colors duration-200 group">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-semibold text-white">
                      {user?.profile?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.profile?.firstName} {user?.profile?.lastName} || user?.email || 'User'
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {user?.role?.toLowerCase() || 'Admin'}
                    </p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </button>

                {/* Dropdown Menu (you can add state management for this) */}
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 hidden">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.profile?.firstName} {user?.profile?.lastName} || user?.email || 'User'
                    </p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <div className="py-2">
                    <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <User className="w-4 h-4 mr-3" />
                      Profile Settings
                    </button>
                    <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <Settings className="w-4 h-4 mr-3" />
                      Account Settings
                    </button>
                    <div className="border-t border-gray-100 my-2"></div>
                    <button 
                      onClick={logout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Header Bar */}
      {finalShowSecondaryBar && (
        <div className="border-t border-gray-100 bg-gray-50/50">
          <div className="px-6 lg:px-8">
            <div className="flex items-center justify-between h-14">
              {/* Quick Stats */}
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">Live Data</span>
                </div>
                <div className="text-sm text-gray-500">
                  Last updated: {new Date().toLocaleTimeString()}
                </div>
              </div>

              {/* Page-specific Action Buttons */}
              <div className="flex items-center space-x-3">
                {finalActions.length > 0 ? (
                  finalActions.map((action, index) => {
                    const ActionIcon = action.icon;
                    return (
                      <button
                        key={index}
                        onClick={action.onClick}
                        className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                          action.variant === 'primary'
                            ? 'text-white bg-purple-600 hover:bg-purple-700'
                            : 'text-gray-700 bg-white border border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <ActionIcon className="w-4 h-4 mr-2" />
                        {action.label}
                      </button>
                    );
                  })
                ) : (
                  <>
                    <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </button>
                    <button 
                      onClick={refreshData}
                      disabled={loading}
                      className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
                    >
                      <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                      Refresh
                    </button>
                    <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors duration-200">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
