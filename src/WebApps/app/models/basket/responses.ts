import type { ShoppingCartModel } from './shopping-cart-model.ts'

export type GetBasketResponse = {
  cart: ShoppingCartModel
}

export type StoreBasketResponse = {
  userName: string
}

export type CheckoutBasketResponse = {
  isSuccess: boolean
}

export type DeleteBasketResponse = {
  isSuccess: boolean
}
