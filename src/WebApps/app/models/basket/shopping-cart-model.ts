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
  totalPrice: number
}
