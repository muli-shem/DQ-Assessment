import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { productsAPI } from '@/lib/api'

// Get all products with optional filters
export function useProducts(params?: { category?: string; search?: string }) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productsAPI.getAll(params),
  })
}

// Get single product by ID
export function useProduct(id: string) {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () => productsAPI.getById(id),
    enabled: !!id, // Only fetch if ID exists
  })
}

// Create product mutation
export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: productsAPI.create,
    onSuccess: () => {
      // Invalidate and refetch products list
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

// Update product mutation
export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      productsAPI.update(id, data),
    onSuccess: (_, variables) => {
      // Invalidate specific product and products list
      queryClient.invalidateQueries({ queryKey: ['products', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

// Delete product mutation
export function useDeleteProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: productsAPI.delete,
    onSuccess: () => {
      // Invalidate products list
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}