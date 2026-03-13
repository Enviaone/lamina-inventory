// Query key factory for consistent and type-safe query keys

export const queryKeys = {
  // Brand queries
  brands: {
    all: ['brands'] as const,
    lists: () => [...queryKeys.brands.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.brands.lists(), filters] as const,
    details: () => [...queryKeys.brands.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.brands.details(), id] as const,
    items: (brandId: string) => [...queryKeys.brands.detail(brandId), 'items'] as const,
  },

  // Location queries
  locations: {
    all: ['locations'] as const,
    lists: () => [...queryKeys.locations.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.locations.lists(), filters] as const,
    details: () => [...queryKeys.locations.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.locations.details(), id] as const,
  },

  // Manufacturing Stage queries
  stages: {
    all: ['stages'] as const,
    config: () => [...queryKeys.stages.all, 'config'] as const,
    submissions: (stageId: string) => [...queryKeys.stages.all, 'submissions', stageId] as const,
    stats: (params?: Record<string, unknown>) => [...queryKeys.stages.all, 'stats', params] as const,
  },

  // User queries
  users: {
    all: ['users'] as const,
    me: () => [...queryKeys.users.all, 'me'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.users.lists(), filters] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
  },

  // Log queries
  logs: {
    all: ['logs'] as const,
    lists: () => [...queryKeys.logs.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.logs.lists(), filters] as const,
  },

  // Dashboard queries
  dashboard: {
    all: ['dashboard'] as const,
    stats: (params?: Record<string, unknown>) =>
      [...queryKeys.dashboard.all, 'stats', params] as const,
    trends: (params?: Record<string, unknown>) =>
      [...queryKeys.dashboard.all, 'trends', params] as const,
  },
} as const;
