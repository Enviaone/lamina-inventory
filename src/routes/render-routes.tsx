import { createBrowserRouter, Navigate } from 'react-router-dom';
import ProtectedRoute from './protected-route';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import { lazyWithRetry } from '@/utils/lazyWithRetry';

//! Lazy load all pages
const Login = lazyWithRetry(() => import('@/pages/Login'));
const Dashboard = lazyWithRetry(() => import('@/pages/Dashboard'));
const Brands = lazyWithRetry(() => import('@/pages/Brands'));
const NotFoundPage = lazyWithRetry(() => import('@/pages/NotFoundPage'));

const router = createBrowserRouter([
  //? Public Routes
  {
    element: <ProtectedRoute isProtected={false} redirectPath="/" />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        path: '/login',
        element: <Login />,
      },
    ],
  },
  //? Protected Routes
  {
    element: <ProtectedRoute isProtected={true} redirectPath="/login" />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        path: '/',
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: '/dashboard',
        element: <Dashboard />,
      },
      {
        path: '/brands',
        element: <Brands />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
    errorElement: <RouteErrorBoundary />,
  },
]);

export default router;
