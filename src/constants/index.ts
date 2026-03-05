export const APP_CONFIG = {
  NAME: 'Lumina Inventory',
  VERSION: '1.0.0',
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
};

export const ROUTES = {
  DASHBOARD: '/',
  INVENTORY: '/inventory',
  PRODUCTS: '/products',
  SETTINGS: '/settings',
};

export const DATE_FORMAT = 'MMM dd, yyyy';
