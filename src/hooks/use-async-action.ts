import { useState } from 'react';
import { toast } from 'sonner';

interface AsyncActionOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  successMessage?: string | ((data: T) => string);
  errorMessage?: string | ((error: Error) => string);
  loadingMessage?: string;
}

export function useAsyncAction<T, Args extends unknown[]>(
  action: (...args: Args) => Promise<T> | T,
  options: AsyncActionOptions<T> = {}
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = async (...args: Args) => {
    setIsLoading(true);
    setError(null);

    const loadingToastId = options.loadingMessage 
      ? toast.loading(options.loadingMessage) 
      : null;

    try {
      const result = await action(...args);
      
      if (loadingToastId) toast.dismiss(loadingToastId);

      if (options.successMessage) {
        const message = typeof options.successMessage === 'function' 
          ? options.successMessage(result) 
          : options.successMessage;
        toast.success(message);
      }

      options.onSuccess?.(result);
      return result;
    } catch (e) {
      const error = e instanceof Error ? e : new Error(String(e));
      setError(error);
      
      if (loadingToastId) toast.dismiss(loadingToastId);

      const message = typeof options.errorMessage === 'function'
        ? options.errorMessage(error)
        : options.errorMessage || error.message || 'An unexpected error occurred';
      
      toast.error(message);
      options.onError?.(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { execute, isLoading, error };
}
