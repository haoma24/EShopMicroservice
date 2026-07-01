import { Link } from 'react-router-dom'
import { ErrorState } from '@/components/ErrorState'
import { useBasket } from '@/hooks/useBasket'

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

export function Basket() {
  const { data: cart, isLoading, isError, refetch } = useBasket()

  if (isLoading) {
    return (
      <section>
        <h1 className="mb-6 text-2xl font-semibold tracking-tight text-gray-900">Your basket</h1>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-lg border border-gray-200 bg-white" />
          ))}
        </div>
      </section>
    )
  }

  if (isError) {
    return (
      <ErrorState
        message="We couldn't load your basket. Please try again."
        onRetry={() => refetch()}
      />
    )
  }

  const items = cart?.items ?? []

  if (items.length === 0) {
    return (
      <section className="py-16 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Your basket is empty</h1>
        <p className="mt-2 text-sm text-gray-500">Browse the catalog to add some products.</p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
        >
          Continue shopping
        </Link>
      </section>
    )
  }

  const total = cart?.totalPrice ?? items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <section>
      <h1 className="mb-6 text-2xl font-semibold tracking-tight text-gray-900">Your basket</h1>

      <ul className="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white">
        {items.map((item) => (
          <li
            key={`${item.productId}-${item.color}`}
            className="flex items-center justify-between gap-4 p-4"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-gray-900">{item.productName}</p>
              <p className="mt-0.5 text-xs text-gray-500">
                Color: {item.color} · Qty: {item.quantity}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-sm font-semibold text-gray-900">
                {priceFormatter.format(item.price * item.quantity)}
              </p>
              <p className="text-xs text-gray-400">{priceFormatter.format(item.price)} each</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
        <span className="text-base font-medium text-gray-900">Total</span>
        <span className="text-lg font-semibold text-gray-900">{priceFormatter.format(total)}</span>
      </div>

      <div className="mt-6 flex justify-end">
        <Link
          to="/checkout"
          className="rounded-md bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-gray-700"
        >
          Proceed to checkout
        </Link>
      </div>
    </section>
  )
}
