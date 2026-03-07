import { AlertCircle, RefreshCw, WifiOff, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary?: () => void;
  showHomeButton?: boolean;
}

export function ErrorFallback({
  error,
  resetErrorBoundary,
  showHomeButton = true,
}: ErrorFallbackProps) {
  // Detect if this is a chunk loading error
  const isChunkError =
    error.message?.includes('Failed to fetch dynamically imported module') ||
    error.message?.includes('Importing a module script failed') ||
    error.message?.includes('error loading dynamically imported module');

  // Detect if user is offline
  const isOffline = !navigator.onLine;

  // Determine error type and messaging
  const getErrorInfo = () => {
    if (isOffline) {
      return {
        icon: WifiOff,
        title: 'No Internet Connection',
        description:
          "It looks like you're offline. Please check your internet connection and try again.",
        variant: 'default' as const,
        actionText: 'Retry',
      };
    }

    if (isChunkError) {
      return {
        icon: RefreshCw,
        title: 'Update Available',
        description:
          'A new version of the application is available. Please refresh the page to load the latest version.',
        variant: 'default' as const,
        actionText: 'Refresh Page',
      };
    }

    return {
      icon: AlertCircle,
      title: 'Something Went Wrong',
      description:
        'An unexpected error occurred. Please try again or contact support if the problem persists.',
      variant: 'destructive' as const,
      actionText: 'Try Again',
    };
  };

  const errorInfo = getErrorInfo();
  const Icon = errorInfo.icon;

  const handleAction = () => {
    if (isChunkError || isOffline) {
      // For chunk errors or offline, do a full page reload
      window.location.reload();
    } else if (resetErrorBoundary) {
      // For other errors, try the error boundary reset
      resetErrorBoundary();
    }
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-muted/20">
      <Card className="w-full max-w-lg shadow-lg border-2">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <Icon className="w-8 h-8 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold">
              {errorInfo.title}
            </CardTitle>
            <CardDescription className="text-base">
              {errorInfo.description}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Show detailed error in development */}
          {import.meta.env.DEV && (
            <Alert variant={errorInfo.variant}>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error Details (Development Only)</AlertTitle>
              <AlertDescription className="mt-2">
                <code className="text-xs block p-2 bg-muted rounded overflow-x-auto">
                  {error.message}
                </code>
              </AlertDescription>
            </Alert>
          )}

          {/* Network status indicator */}
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <div
              className={`w-2 h-2 rounded-full ${
                navigator.onLine ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
            <span>{navigator.onLine ? 'Connected' : 'Disconnected'}</span>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-3">
          <Button onClick={handleAction} className="w-full sm:flex-1" size="lg">
            <RefreshCw className="w-4 h-4 mr-2" />
            {errorInfo.actionText}
          </Button>
          {showHomeButton && !isOffline && (
            <Button
              onClick={handleGoHome}
              variant="outline"
              className="w-full sm:flex-1"
              size="lg"
            >
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
