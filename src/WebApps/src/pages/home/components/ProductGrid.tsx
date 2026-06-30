import type { ProductModel } from '@/models/catalog/product-model'
import { ProductCard } from './ProductCard'

type ProductGridProps = {
  products: ProductModel[]
}

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
