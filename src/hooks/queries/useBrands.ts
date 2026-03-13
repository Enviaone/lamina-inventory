import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { brandService } from '@/services/brand.service';
import { queryKeys } from '@/lib/query-keys';
import type { Brand, BrandItem } from '@/types/brand';
import { toast } from 'sonner';

export function useBrands(search?: string) {
  return useQuery({
    queryKey: queryKeys.brands.list({ search }),
    queryFn: () => brandService.getBrands(search),
  });
}

export function useBrand(id: string) {
  return useQuery({
    queryKey: queryKeys.brands.detail(id),
    queryFn: () => brandService.getBrand(id),
    enabled: !!id,
  });
}

export function useBrandItems(brandId: string, search?: string) {
  return useQuery({
    queryKey: [...queryKeys.brands.items(brandId), { search }],
    queryFn: () => brandService.getBrandItems(brandId, search),
    enabled: !!brandId,
  });
}

export function useCreateBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: brandService.createBrand,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.brands.lists() });
      toast.success('Brand created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create brand');
    },
  });
}

export function useUpdateBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Brand> }) =>
      brandService.updateBrand(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.brands.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.brands.detail(variables.id) });
      toast.success('Brand updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update brand');
    },
  });
}

export function useDeleteBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: brandService.deleteBrand,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.brands.lists() });
      toast.success('Brand deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete brand');
    },
  });
}

export function useAddBrandItem(brandId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<BrandItem, 'id'>) =>
      brandService.addItemToBrand(brandId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.brands.items(brandId) });
      toast.success('Item added successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add item');
    },
  });
}

export function useUpdateBrandItem(brandId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, data }: { itemId: string; data: Partial<BrandItem> }) =>
      brandService.updateBrandItem(brandId, itemId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.brands.items(brandId) });
      toast.success('Item updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update item');
    },
  });
}

export function useDeleteBrandItem(brandId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) =>
      brandService.deleteBrandItem(brandId, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.brands.items(brandId) });
      toast.success('Item deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete item');
    },
  });
}
