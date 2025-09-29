'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BarChart3, 
  Users, 
  Package, 
  FileText, 
  Settings, 
  Home,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAuth } from '@/hooks/useAuth';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Inventory', href: '/inventory', icon: Package },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <>
      {/* Mobile sidebar */}
      <div className={cn(
        'fixed inset-0 z-50 lg:hidden',
        sidebarOpen ? 'block' : 'hidden'
      )}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white shadow-lg">
          <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold text-gray-900">Dashboard</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <SidebarContent pathname={pathname} onNavigate={() => setSidebarOpen(false)} />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 shadow-sm">
          <div className="flex h-16 items-center px-6 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold text-gray-900">Dashboard</span>
            </div>
          </div>
          <SidebarContent pathname={pathname} />
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="lg:hidden">
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-4 left-4 z-40 rounded-md bg-white p-2 text-gray-400 shadow-sm hover:text-gray-600"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>
    </>
  );
}

function SidebarContent({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  const { user, logout } = useAuth();

  return (
    <div className="flex flex-col flex-grow">
      <nav className="flex-1 px-4 py-8 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                isActive
                  ? 'bg-purple-50 text-purple-700'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <item.icon
                className={cn(
                  'mr-3 h-5 w-5 flex-shrink-0',
                  isActive ? 'text-purple-500' : 'text-gray-400 group-hover:text-gray-500'
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User profile section */}
      <div className="flex-shrink-0 border-t border-gray-200 p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-purple-600 flex items-center justify-center">
              <span className="text-sm font-medium text-white">
                {user?.profile?.firstName?.[0] || user?.email?.[0]?.toUpperCase()}
              </span>
            </div>
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900">
              {user?.profile?.firstName} {user?.profile?.lastName} || user?.email
            </p>
            <p className="text-xs text-gray-500 capitalize">{user?.role?.toLowerCase()}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="mt-4 w-full text-left text-sm text-gray-500 hover:text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
