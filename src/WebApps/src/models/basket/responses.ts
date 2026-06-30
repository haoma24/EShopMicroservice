import type { ShoppingCartModel } from './cart-model'

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
