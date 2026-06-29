export type CreateProductRequest = {
  name: string
  category: string[]
  description: string
  imageFile: string
  price: number
}

export type UpdateProductRequest = {
  id: string
  name: string
  category: string[]
  description: string
  imageFile: string
  price: number
}
