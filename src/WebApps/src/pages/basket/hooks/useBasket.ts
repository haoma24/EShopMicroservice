import { useQuery } from '@tanstack/react-query'
import { getBasket } from '@/services/basket.service'
import type { ShoppingCartModel } from '@/models/basket/cart-model'
import { DEFAULT_USER_NAME } from '@/lib/constants'
import { basketKeys } from '@/lib/query-keys'

// A first-time user has no stored basket (the service 404s); treat that as an
// empty cart rather than an error.
async function fetchBasket(userName: string): Promise<ShoppingCartModel> {
  try {
    const { cart } = await getBasket(userName)
    return cart
  } catch {
    return { userName, items: [] }
  }
}

export function useBasket(userName: string = DEFAULT_USER_NAME) {
  return useQuery({
    queryKey: basketKeys.detail(userName),
    queryFn: () => fetchBasket(userName),
  })
}
