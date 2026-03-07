import { useRouteError, isRouteErrorResponse } from 'react-router-dom';
import { ErrorFallback } from './ErrorFallback';

export function RouteErrorBoundary() {
  const error = useRouteError();

  // Convert route error to Error object for ErrorFallback
  let errorObject: Error;

  if (isRouteErrorResponse(error)) {
    errorObject = new Error(
      `${error.status} ${error.statusText}: ${error.data?.message || ''}`,
    );
  } else if (error instanceof Error) {
    errorObject = error;
  } else {
    errorObject = new Error('An unexpected error occurred');
  }

  return <ErrorFallback error={errorObject} showHomeButton={true} />;
}
