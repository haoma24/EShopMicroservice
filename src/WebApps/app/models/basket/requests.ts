import type { ShoppingCartModel } from './shopping-cart-model.ts'
import type { BasketCheckoutModel } from './basket-checkout-model.ts'

export type StoreBasketRequest = {
  cart: ShoppingCartModel
}

export type CheckoutBasketRequest = {
  basketCheckoutDto: BasketCheckoutModel
}
