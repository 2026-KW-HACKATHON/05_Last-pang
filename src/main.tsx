import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import { AuthProvider } from '@/app/AuthProvider';
import { router } from '@/app/router';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 },
    mutations: { retry: 0 }, // 쿠폰 받기·사용은 자동 재시도 금지 (중복 처리 위험)
  },
});

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('#root 요소가 index.html에 없습니다.');
}

createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);
