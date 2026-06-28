import type { ProductModel } from './product-model.ts'

// wrapper classes
export type GetProductsResponse = {
  products: ProductModel[]
}

export type GetProductByCategoryResponse = {
  products: ProductModel[]
}

export type GetProductByIdResponse = {
  product: ProductModel
}
