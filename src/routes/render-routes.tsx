import { createBrowserRouter, Navigate } from 'react-router-dom';
import ProtectedRoute from './protected-route';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import { lazyWithRetry } from '@/utils/lazyWithRetry';

//! Lazy load all pages
const Login = lazyWithRetry(() => import('@/pages/LoginPage'));
const Dashboard = lazyWithRetry(() => import('@/pages/Dashboard'));
const Brands = lazyWithRetry(() => import('@/pages/Brands'));
const StagePage = lazyWithRetry(() => import('@/pages/StagePage'));
const NotFoundPage = lazyWithRetry(() => import('@/pages/NotFoundPage'));
const BrandItemsPage = lazyWithRetry(() => import('@/pages/BrandItemsPage'));
const LocationPage = lazyWithRetry(() => import('@/pages/LocationPage'));
const LogPage = lazyWithRetry(() => import('@/pages/LogPage'));
const UserManagementPage = lazyWithRetry(
  () => import('@/pages/UserManagementPage'),
);
const ReportsPage = lazyWithRetry(() => import('@/pages/ReportsPage'));

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
      {
        path: '/brands/:brandId',
        element: <BrandItemsPage />,
      },
      {
        path: '/locations',
        element: <LocationPage />,
      },
      {
        path: '/stages/:stageSlug',
        element: <StagePage />,
      },
      {
        path: '/logs',
        element: <LogPage />,
      },
      {
        path: '/users',
        element: <UserManagementPage />,
      },
      {
        path: '/reports',
        element: <ReportsPage />,
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
