import { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';

import { Spinner } from '@/components/ui/spinner';
import router from './render-routes';

// Loading fallback component
const pageLoader = (
  <div className="flex items-center justify-center min-h-screen">
    <div className="flex flex-col items-center gap-4">
      <Spinner className="h-8 w-8" />
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  </div>
);

const Routes = () => {
  return (
    <Suspense fallback={pageLoader}>
      <RouterProvider router={router} />
      <Toaster position="bottom-right" />
    </Suspense>
  );
};

export default Routes;
