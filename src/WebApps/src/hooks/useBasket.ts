import { useQuery } from '@tanstack/react-query'
import { DEFAULT_USER_NAME } from '@/lib/constants'
import { basketKeys } from '@/lib/query-keys'
import { loadUserBasket } from './basket-cart'

export function useBasket(userName: string = DEFAULT_USER_NAME) {
  return useQuery({
    queryKey: basketKeys.detail(userName),
    queryFn: () => loadUserBasket(userName),
  })
}
