import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getBasket, storeBasket } from '@/services/basket.service'
import type { ProductModel } from '@/models/catalog/product-model'
import type { ShoppingCartModel } from '@/models/basket/cart-model'
import { DEFAULT_USER_NAME } from '@/lib/constants'

export const basketKeys = {
  all: ['basket'] as const,
  detail: (userName: string) => [...basketKeys.all, userName] as const,
}

// Loads the user's basket, falling back to an empty cart when none exists yet
// (the basket service returns 404 for a first-time user).
async function loadUserBasket(userName: string): Promise<ShoppingCartModel> {
  try {
    const { cart } = await getBasket(userName)
    return cart
  } catch {
    return { userName, items: [] }
  }
}

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
