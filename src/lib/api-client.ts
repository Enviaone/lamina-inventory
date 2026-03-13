import axios, {
  AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
} from 'axios';
import { ApiError, type ApiErrorResponse } from '@/types/types';

// Determine base URL based on environment
// Default to production URL, override with VITE_API_BASE_URL if needed
const getBaseURL = () => {
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';
};

// Create Axios instance with base configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: getBaseURL(),
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token and other headers
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage
    const token = localStorage.getItem('access_token');

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request timestamp for debugging
    if (config.headers) {
      config.headers['X-Request-Time'] = new Date().toISOString();
    }

    // Add correlation ID for request tracking
    if (config.headers) {
      config.headers['X-Correlation-ID'] = crypto.randomUUID();
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle responses and errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Transform successful response
    return response;
  },
  async (error: AxiosError<ApiErrorResponse>) => {
    // Handle different error scenarios
    if (error.response) {
      const { status, data } = error.response;

      // Handle 401 Unauthorized - Token expired or invalid
      if (status === 401) {
        // Clear token and redirect to login
        localStorage.removeItem('access_token');
        window.location.href = '/login';

        throw new ApiError(
          data?.error?.message || 'Unauthorized. Please login again.',
          status,
          data?.error?.code || 'UNAUTHORIZED',
          data?.error?.details
        );
      }

      // Handle 403 Forbidden - Insufficient permissions
      if (status === 403) {
        throw new ApiError(
          data?.error?.message ||
            'You do not have permission to perform this action.',
          status,
          data?.error?.code || 'FORBIDDEN',
          data?.error?.details
        );
      }

      // Handle 404 Not Found
      if (status === 404) {
        throw new ApiError(
          data?.error?.message || 'Resource not found.',
          status,
          data?.error?.code || 'NOT_FOUND',
          data?.error?.details
        );
      }

      // Handle 429 Too Many Requests - Rate limiting
      if (status === 429) {
        const retryAfter = error.response.headers['retry-after'];
        throw new ApiError(
          data?.error?.message ||
            `Too many requests. Please try again ${
              retryAfter ? `after ${retryAfter} seconds` : 'later'
            }.`,
          status,
          data?.error?.code || 'RATE_LIMIT_EXCEEDED',
          { retryAfter, ...data?.error?.details }
        );
      }

      // Handle 500 Internal Server Error
      if (status >= 500) {
        throw new ApiError(
          data?.error?.message ||
            'An unexpected error occurred. Please try again later.',
          status,
          data?.error?.code || 'INTERNAL_SERVER_ERROR',
          data?.error?.details
        );
      }

      // Handle other error responses
      throw new ApiError(
        data?.error?.message || 'An error occurred.',
        status,
        data?.error?.code || 'API_ERROR',
        data?.error?.details
      );
    }

    // Handle network errors
    if (error.request) {
      throw new ApiError(
        'Network error. Please check your internet connection.',
        0,
        'NETWORK_ERROR'
      );
    }

    // Handle other errors
    throw new ApiError(
      error.message || 'An unexpected error occurred.',
      0,
      'UNKNOWN_ERROR'
    );
  }
);

export default apiClient;
