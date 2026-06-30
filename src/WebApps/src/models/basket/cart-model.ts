// Mirrors Basket.API.Models.ShoppingCart / ShoppingCartItem

export type ShoppingCartItemModel = {
  quantity: number
  color: string
  price: number
  productId: string
  productName: string
}

export type ShoppingCartModel = {
  userName: string
  items: ShoppingCartItemModel[]
  // Computed server-side (read-only); present on responses.
  totalPrice?: number
}
