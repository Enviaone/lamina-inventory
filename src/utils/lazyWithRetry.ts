/* eslint-disable @typescript-eslint/no-explicit-any */
import { lazy, type ComponentType, type LazyExoticComponent } from 'react';

/**
 * Lazy load component with retry logic
 * Retries failed chunk loads up to 3 times before giving up
 */
export function lazyWithRetry<T extends ComponentType<any>>(
  componentImport: () => Promise<{ default: T }>
): LazyExoticComponent<T> {
  return lazy(async () => {
    const maxRetries = 3;
    const retryDelay = 1000; // 1 second

    for (let i = 0; i < maxRetries; i++) {
      try {
        return await componentImport();
      } catch (error) {
        // If this is the last retry, throw the error
        if (i === maxRetries - 1) {
          console.error('Failed to load component after retries:', error);
          throw error;
        }

        // Wait before retrying
        await new Promise((resolve) => setTimeout(resolve, retryDelay));

        console.warn(
          `Retrying component load (attempt ${i + 2}/${maxRetries})...`
        );
      }
    }

    // This should never be reached, but TypeScript needs it
    throw new Error('Failed to load component');
  });
}
