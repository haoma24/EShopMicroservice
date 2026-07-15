import { useQuery } from '@tanstack/react-query'
import { getOrders } from '@/services/ordering.service'
import { orderKeys } from '@/lib/query-keys'

// PageIndex is zero-based to match the ordering API (first page = 0).
export function useOrders(pageIndex = 0, pageSize = 10) {
  return useQuery({
    queryKey: orderKeys.list(pageIndex, pageSize),
    queryFn: () => getOrders(pageIndex, pageSize),
    select: (data) => data.orders,
  })
}
