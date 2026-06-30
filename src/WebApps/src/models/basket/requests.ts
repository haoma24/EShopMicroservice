import type { ShoppingCartModel } from './cart-model'

export type StoreBasketRequest = {
  cart: ShoppingCartModel
}

export type CheckoutBasketRequest = {
  userName: string
  customerId: string
  firstName: string
  lastName: string
  emailAddress: string
  addressLine: string
  country: string
  state: string
  zipCode: string
  cardName: string
  cardNumber: string
  expiration: string
  cvv: string
  paymentMethod: number
}
