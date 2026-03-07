import { Navigate, Outlet } from 'react-router-dom';
import { Spinner } from '@/components/ui/spinner';

interface ProtectedRouteProps {
  isProtected?: boolean;
  redirectPath?: string;
}

const ProtectedRoute = ({
  isProtected = false,
  redirectPath = '/login',
}: ProtectedRouteProps) => {
  const isAuthenticated = false;
  const isLoading = false;

  // Show loading spinner while checking auth status
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="h-8 w-8" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect unauthenticated users from protected routes
  if (isProtected && !isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  // Redirect authenticated users from auth pages (login/register)
  if (!isProtected && isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
