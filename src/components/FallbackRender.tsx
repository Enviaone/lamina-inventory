import type { FallbackProps } from 'react-error-boundary';
import { ErrorFallback } from '@/components/ErrorFallback';

const FallbackRender = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
    <ErrorFallback
      error={error}
      resetErrorBoundary={resetErrorBoundary}
      showHomeButton={true}
    />
  );
};

export default FallbackRender;
