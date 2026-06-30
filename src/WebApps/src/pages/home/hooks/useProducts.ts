import { useQuery } from '@tanstack/react-query'
import { getProducts } from '@/services/catalog.service'

export const productKeys = {
  all: ['products'] as const,
  list: (pageNumber: number, pageSize: number) =>
    [...productKeys.all, 'list', { pageNumber, pageSize }] as const,
}

export function useProducts(pageNumber = 1, pageSize = 10) {
  return useQuery({
    queryKey: productKeys.list(pageNumber, pageSize),
    queryFn: () => getProducts(pageNumber, pageSize),
    select: (data) => data.products,
  })
}
