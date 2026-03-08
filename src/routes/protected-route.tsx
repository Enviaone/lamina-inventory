import { Navigate, Outlet } from 'react-router-dom';
import { Spinner } from '@/components/ui/spinner';
import { useAuthStore } from '@/store/auth-store';

interface ProtectedRouteProps {
  isProtected?: boolean;
  redirectPath?: string;
}

const ProtectedRoute = ({
  isProtected = false,
  redirectPath = '/login',
}: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuthStore();
  const isLoading = false; // replace with real loading state when wiring real auth

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

  // Redirect authenticated users away from auth pages (e.g. /login)
  if (!isProtected && isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet context={{ user }} />;
};

export default ProtectedRoute;
