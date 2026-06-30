// Mirrors Ordering.Application.Dtos.* exposed at the Ordering API boundary.

export type AddressModel = {
  firstName: string
  lastName: string
  emailAddress: string
  addressLine: string
  country: string
  state: string
  zipCode: string
}

export type PaymentModel = {
  cardName?: string | null
  cardNumber: string
  expiration: string
  cvv: string
  paymentMethod: number
}

export type OrderItemModel = {
  orderId: string
  productId: string
  quantity: number
  price: number
}

// OrderStatus enum is serialized as its numeric value.
export type OrderStatus = number

export type OrderModel = {
  id: string
  customerId: string
  orderName: string
  shippingAddress: AddressModel
  billingAddress: AddressModel
  payment: PaymentModel
  status: OrderStatus
  orderItems: OrderItemModel[]
}
