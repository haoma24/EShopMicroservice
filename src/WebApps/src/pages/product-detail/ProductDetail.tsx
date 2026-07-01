import { Link, useParams } from 'react-router-dom'
import { ErrorState } from '@/components/ErrorState'
import { AddToCartButton } from '@/components/AddToCartButton'
import { resolveProductImage, PRODUCT_IMAGE_FALLBACK } from '@/lib/product-image'
import { useProduct } from './hooks/useProduct'

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

export function ProductDetail() {
  const { id } = useParams()
  const { data: product, isLoading, isError, refetch } = useProduct(id)

  if (isLoading) {
    return (
      <div className="grid gap-8 md:grid-cols-2">
        <div className="aspect-square animate-pulse rounded-lg bg-gray-200" />
        <div className="space-y-4">
          <div className="h-4 w-1/4 animate-pulse rounded bg-gray-200" />
          <div className="h-8 w-3/4 animate-pulse rounded bg-gray-200" />
          <div className="h-6 w-1/3 animate-pulse rounded bg-gray-200" />
          <div className="h-24 w-full animate-pulse rounded bg-gray-200" />
          <div className="h-11 w-40 animate-pulse rounded bg-gray-200" />
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <ErrorState
        message="We couldn't load this product. It may not exist or the service is unavailable."
        onRetry={() => refetch()}
      />
    )
  }

  if (!product) {
    return (
      <section className="py-16 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Product not found</h1>
        <Link
          to="/"
          className="mt-6 inline-block rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
        >
          Back to products
        </Link>
      </section>
    )
  }

  return (
    <div>
      <nav className="mb-6 text-sm text-gray-500">
        <Link to="/" className="hover:text-gray-900">
          Products
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
          <img
            src={resolveProductImage(product.imageFile)}
            alt={product.name}
            className="h-full w-full object-cover"
            onError={(e) => {
              if (e.currentTarget.src !== PRODUCT_IMAGE_FALLBACK) {
                e.currentTarget.src = PRODUCT_IMAGE_FALLBACK
                e.currentTarget.classList.add('object-contain', 'p-16', 'opacity-60')
              }
            }}
          />
        </div>

        <div className="flex flex-col">
          {product.category[0] && (
            <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
              {product.category.join(' · ')}
            </span>
          )}
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
            {product.name}
          </h1>
          <span className="mt-4 text-2xl font-semibold text-gray-900">
            {priceFormatter.format(product.price)}
          </span>

          <p className="mt-6 text-sm leading-relaxed text-gray-600">{product.description}</p>

          <div className="mt-8 max-w-xs">
            <AddToCartButton product={product} size="lg" />
          </div>
        </div>
      </div>
    </div>
  )
}
