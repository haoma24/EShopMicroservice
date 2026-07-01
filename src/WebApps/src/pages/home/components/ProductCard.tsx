import { Link } from 'react-router-dom'
import type { ProductModel } from '@/models/catalog/product-model'
import { resolveProductImage, PRODUCT_IMAGE_FALLBACK } from '@/lib/product-image'
import { AddToCartButton } from '@/components/AddToCartButton'

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

type ProductCardProps = {
  product: ProductModel
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-md">
      <Link to={`/products/${product.id}`} className="block aspect-square overflow-hidden bg-gray-100">
        <img
          src={resolveProductImage(product.imageFile)}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
          onError={(e) => {
            if (e.currentTarget.src !== PRODUCT_IMAGE_FALLBACK) {
              e.currentTarget.src = PRODUCT_IMAGE_FALLBACK
              e.currentTarget.classList.add('object-contain', 'p-8', 'opacity-60')
            }
          }}
        />
      </Link>
      <div className="flex flex-1 flex-col gap-1 p-4">
        {product.category[0] && (
          <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
            {product.category[0]}
          </span>
        )}
        <h3 className="line-clamp-2 text-sm font-medium text-gray-900">
          <Link to={`/products/${product.id}`} className="hover:text-gray-600">
            {product.name}
          </Link>
        </h3>
        <span className="mt-auto pt-2 text-base font-semibold text-gray-900">
          {priceFormatter.format(product.price)}
        </span>

        <div className="mt-3">
          <AddToCartButton product={product} />
        </div>
      </div>
    </article>
  )
}
