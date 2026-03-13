import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { brandService } from '@/services/brand.service';
import { queryKeys } from '@/lib/query-keys';
import { type Brand, type BrandItem, MOCK_BRANDS } from '@/types/brand';
import { toast } from 'sonner';

export function useBrands(search?: string) {
  return useQuery({
    queryKey: queryKeys.brands.list({ search }),
    queryFn: async () => {
      // Simulate simple search filtering
      if (!search) return MOCK_BRANDS;
      return MOCK_BRANDS.filter((b) =>
        b.name.toLowerCase().includes(search.toLowerCase())
      );
    },
  });
}

export function useBrand(id: string) {
  return useQuery({
    queryKey: queryKeys.brands.detail(id),
    queryFn: async () => {
      const found = MOCK_BRANDS.find((b) => b.id === id);
      if (!found) throw new Error('Brand not found');
      return found;
    },
    enabled: !!id,
  });
}

export function useBrandItems(brandId: string, search?: string) {
  return useQuery({
    queryKey: [...queryKeys.brands.items(brandId), { search }],
    queryFn: async () => {
      const brand = MOCK_BRANDS.find((b) => b.id === brandId);
      if (!brand) return [];

      const items = brand.items;
      if (!search) return items;

      return items.filter((i) =>
        i.name.toLowerCase().includes(search.toLowerCase())
      );
    },
    enabled: !!brandId,
  });
}

export function useCreateBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<Brand, 'id' | 'items'>) => {
      // Simulate API call
      console.log('Mock: Create brand', data);
      await new Promise(r => setTimeout(r, 500));
      return { id: Math.random().toString(), ...data, items: [] };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.brands.lists() });
      toast.success('Brand created successfully (Mock)');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create brand');
    },
  });
}

export function useUpdateBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Brand> }) => {
      console.log('Mock: Update brand', id, data);
      await new Promise(r => setTimeout(r, 500));
      return { id, ...data } as Brand;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.brands.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.brands.detail(variables.id) });
      toast.success('Brand updated successfully (Mock)');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update brand');
    },
  });
}

export function useDeleteBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      console.log('Mock: Delete brand', id);
      await new Promise(r => setTimeout(r, 500));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.brands.lists() });
      toast.success('Brand deleted successfully (Mock)');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete brand');
    },
  });
}

export function useAddBrandItem(brandId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<BrandItem, 'id'>) => {
      console.log('Mock: Add item to', brandId, data);
      await new Promise(r => setTimeout(r, 500));
      return { id: Math.random().toString(), ...data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.brands.items(brandId) });
      toast.success('Item added successfully (Mock)');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add item');
    },
  });
}

export function useUpdateBrandItem(brandId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ itemId, data }: { itemId: string; data: Partial<BrandItem> }) => {
      console.log('Mock: Update item', itemId, data);
      await new Promise(r => setTimeout(r, 500));
      return { id: itemId, ...data } as BrandItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.brands.items(brandId) });
      toast.success('Item updated successfully (Mock)');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update item');
    },
  });
}

export function useDeleteBrandItem(brandId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemId: string) => {
      console.log('Mock: Delete item', itemId);
      await new Promise(r => setTimeout(r, 500));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.brands.items(brandId) });
      toast.success('Item deleted successfully (Mock)');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete item');
    },
  });
}
