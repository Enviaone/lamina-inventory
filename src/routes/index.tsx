import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { RootLayout } from '@/layouts/root-layout';
import { DashboardPage } from '@/pages/dashboard-page';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'inventory',
        element: <div>Inventory Page (Coming Soon)</div>,
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
