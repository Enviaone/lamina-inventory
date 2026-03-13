import apiClient from '@/lib/api-client';
import type { Brand, BrandItem } from '@/types/brand';

export const brandService = {
  /**
   * Get all brands
   */
  getBrands: async (search?: string): Promise<Brand[]> => {
    const params = new URLSearchParams();
    if (search) {
      params.append('search', search);
    }
    const response = await apiClient.get<Brand[]>('/brands', { params });
    return response.data;
  },

  /**
   * Get a single brand by ID
   */
  getBrand: async (id: string): Promise<Brand> => {
    const response = await apiClient.get<Brand>(`/brands/${id}`);
    return response.data;
  },

  /**
   * Create a new brand
   */
  createBrand: async (data: Omit<Brand, 'id' | 'items'>): Promise<Brand> => {
    const response = await apiClient.post<Brand>('/brands', data);
    return response.data;
  },

  /**
   * Update an existing brand
   */
  updateBrand: async (id: string, data: Partial<Omit<Brand, 'id' | 'items'>>): Promise<Brand> => {
    const response = await apiClient.put<Brand>(`/brands/${id}`, data);
    return response.data;
  },

  /**
   * Delete a brand
   */
  deleteBrand: async (id: string): Promise<void> => {
    await apiClient.delete(`/brands/${id}`);
  },

  /**
   * Get all items for a brand
   */
  getBrandItems: async (brandId: string, search?: string): Promise<BrandItem[]> => {
    const params = new URLSearchParams();
    if (search) {
      params.append('search', search);
    }
    const response = await apiClient.get<BrandItem[]>(`/brands/${brandId}/items`, { params });
    return response.data;
  },

  /**
   * Add a new item to a brand
   */
  addItemToBrand: async (brandId: string, data: Omit<BrandItem, 'id'>): Promise<BrandItem> => {
    const response = await apiClient.post<BrandItem>(`/items`, { ...data, brandId });
    return response.data;
  },

  /**
   * Update an item within a brand
   */
  updateBrandItem: async (brandId: string, itemId: string, data: Partial<Omit<BrandItem, 'id'>>): Promise<BrandItem> => {
    const response = await apiClient.put<BrandItem>(`/items/${itemId}`, data);
    return response.data;
  },

  /**
   * Delete an item from a brand
   */
  deleteBrandItem: async (brandId: string, itemId: string): Promise<void> => {
    await apiClient.delete(`/items/${itemId}`);
  },
};
