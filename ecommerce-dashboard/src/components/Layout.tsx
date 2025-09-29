'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { cn } from '@/utils/cn';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="lg:pl-64">
        <Header />
        <main className="py-6">
          <div className="mx-auto  px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
