import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Routes from './routes';
import { ErrorBoundary } from 'react-error-boundary';
import FallbackRender from './components/FallbackRender';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/query-client';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary FallbackComponent={FallbackRender}>
      <QueryClientProvider client={queryClient}>
        <Routes />
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>,
);
