import type { ProductModel } from './product-model'

export type GetProductsResponse = {
  products: ProductModel[]
}

export type GetProductByIdResponse = {
  product: ProductModel
}

export type GetProductByCategoryResponse = {
  products: ProductModel[]
}
