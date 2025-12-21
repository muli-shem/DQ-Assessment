'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  // Create a client instance for each user session
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // Data stays fresh for 1 minute
        refetchOnWindowFocus: false, // Don't refetch on window focus
        retry: 1, // Retry failed requests once
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* DevTools - only shows in development */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}