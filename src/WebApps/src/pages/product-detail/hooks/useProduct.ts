import { useQuery } from '@tanstack/react-query'
import { getProductById } from '@/services/catalog.service'
import { productKeys } from '@/lib/query-keys'

export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: productKeys.detail(id ?? ''),
    queryFn: () => getProductById(id as string),
    select: (data) => data.product,
    enabled: Boolean(id),
  })
}
