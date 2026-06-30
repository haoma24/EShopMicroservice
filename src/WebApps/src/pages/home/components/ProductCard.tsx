import { useEffect } from 'react'
import type { ProductModel } from '@/models/catalog/product-model'
import { resolveProductImage, PRODUCT_IMAGE_FALLBACK } from '@/lib/product-image'
import { useAddToCart } from '../hooks/useAddToCart'

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

type ProductCardProps = {
  product: ProductModel
}

export function ProductCard({ product }: ProductCardProps) {
  const addToCart = useAddToCart()
  const justAdded = addToCart.isSuccess

  // Revert the "Added" confirmation back to the default state after a moment.
  useEffect(() => {
    if (!addToCart.isSuccess) return
    const timer = setTimeout(() => addToCart.reset(), 1800)
    return () => clearTimeout(timer)
  }, [addToCart.isSuccess, addToCart])

  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-md">
      <div className="aspect-square overflow-hidden bg-gray-100">
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
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        {product.category[0] && (
          <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
            {product.category[0]}
          </span>
        )}
        <h3 className="line-clamp-2 text-sm font-medium text-gray-900">{product.name}</h3>
        <span className="mt-auto pt-2 text-base font-semibold text-gray-900">
          {priceFormatter.format(product.price)}
        </span>

        <button
          type="button"
          onClick={() => addToCart.mutate(product)}
          disabled={addToCart.isPending}
          className="mt-3 inline-flex items-center justify-center gap-2 rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {addToCart.isPending ? (
            <>
              <span
                className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                aria-hidden="true"
              />
              Adding…
            </>
          ) : justAdded ? (
            <>
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
              Added
            </>
          ) : (
            <>
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="8" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
              </svg>
              Add to cart
            </>
          )}
        </button>

        {addToCart.isError && (
          <p className="mt-1 text-xs text-red-600">Couldn’t add to cart. Try again.</p>
        )}
      </div>
    </article>
  )
}
