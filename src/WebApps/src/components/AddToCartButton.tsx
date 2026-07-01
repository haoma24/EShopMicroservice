import { useEffect } from 'react'
import type { ProductModel } from '@/models/catalog/product-model'
import { useAddToCart } from '@/hooks/useAddToCart'

type AddToCartButtonProps = {
  product: ProductModel
  size?: 'md' | 'lg'
}

const sizeClasses = {
  md: 'px-3 py-2 text-sm',
  lg: 'px-5 py-3 text-base',
}

export function AddToCartButton({ product, size = 'md' }: AddToCartButtonProps) {
  const addToCart = useAddToCart()
  const justAdded = addToCart.isSuccess

  // Revert the "Added" confirmation back to the default state after a moment.
  useEffect(() => {
    if (!addToCart.isSuccess) return
    const timer = setTimeout(() => addToCart.reset(), 1800)
    return () => clearTimeout(timer)
  }, [addToCart.isSuccess, addToCart])

  return (
    <div>
      <button
        type="button"
        onClick={() => addToCart.mutate(product)}
        disabled={addToCart.isPending}
        className={`inline-flex w-full items-center justify-center gap-2 rounded-md bg-gray-900 font-medium text-white transition-colors hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60 ${sizeClasses[size]}`}
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
  )
}
