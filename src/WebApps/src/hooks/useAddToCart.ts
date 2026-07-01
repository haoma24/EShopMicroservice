import { useMutation, useQueryClient } from '@tanstack/react-query'
import { storeBasket } from '@/services/basket.service'
import type { ProductModel } from '@/models/catalog/product-model'
import { DEFAULT_USER_NAME } from '@/lib/constants'
import { basketKeys } from '@/lib/query-keys'
import { loadUserBasket } from './basket-cart'

// Mirrors the reference `OnPostAddToCartAsync`: load basket, add the product as
// a line item (quantity 1, default color), then persist the whole basket.
export function useAddToCart() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (product: ProductModel) => {
      const userName = DEFAULT_USER_NAME
      const basket = await loadUserBasket(userName)

      const existing = basket.items.find((item) => item.productId === product.id)
      if (existing) {
        existing.quantity += 1
      } else {
        basket.items.push({
          productId: product.id,
          productName: product.name,
          price: product.price,
          quantity: 1,
          color: 'Black',
        })
      }

      return storeBasket({ cart: basket })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: basketKeys.all })
    },
  })
}
