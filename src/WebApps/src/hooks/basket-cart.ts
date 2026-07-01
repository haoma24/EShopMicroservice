import { getBasket } from '@/services/basket.service'
import type { ShoppingCartModel } from '@/models/basket/cart-model'

// Loads a user's basket, falling back to an empty cart when none exists yet
// (the basket service returns 404 for a first-time user).
export async function loadUserBasket(userName: string): Promise<ShoppingCartModel> {
  try {
    const { cart } = await getBasket(userName)
    return cart
  } catch {
    return { userName, items: [] }
  }
}
