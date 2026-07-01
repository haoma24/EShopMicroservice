import { useQuery } from '@tanstack/react-query'
import { getProducts } from '@/services/catalog.service'
import { productKeys } from '@/lib/query-keys'

export function useProducts(pageNumber = 1, pageSize = 10) {
  return useQuery({
    queryKey: productKeys.list(pageNumber, pageSize),
    queryFn: () => getProducts(pageNumber, pageSize),
    select: (data) => data.products,
  })
}
