'use client';

import { Provider } from 'react-redux';
import { ApolloProvider } from '@apollo/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { store } from '@/lib/store';
import { apolloClient } from '@/lib/apollo-client';
import { Layout } from '@/components/Layout';
import "./globals.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Provider store={store}>
          <ApolloProvider client={apolloClient}>
            <QueryClientProvider client={queryClient}>
              <Layout>
                {children}
              </Layout>
              <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
          </ApolloProvider>
        </Provider>
      </body>
    </html>
  );
}
