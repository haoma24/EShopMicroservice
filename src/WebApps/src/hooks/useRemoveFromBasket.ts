import { useMutation, useQueryClient } from '@tanstack/react-query'
import { storeBasket } from '@/services/basket.service'
import { DEFAULT_USER_NAME } from '@/lib/constants'
import { basketKeys } from '@/lib/query-keys'
import { loadUserBasket } from './basket-cart'

type RemoveArgs = {
  productId: string
  color: string
}

// Removes a line item, then persists the whole basket (there is no dedicated
// remove endpoint — the basket is stored as one document).
export function useRemoveFromBasket() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ productId, color }: RemoveArgs) => {
      const basket = await loadUserBasket(DEFAULT_USER_NAME)
      basket.items = basket.items.filter(
        (item) => !(item.productId === productId && item.color === color),
      )
      return storeBasket({ cart: basket })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: basketKeys.all })
    },
  })
}
