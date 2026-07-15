import { Link } from 'react-router-dom'
import { ErrorState } from '@/components/ErrorState'
import type { OrderModel, OrderStatus } from '@/models/ordering/order-model'
import { useOrders } from './hooks/useOrders'

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

// Mirrors Ordering.Domain.Enums.OrderStatus (serialized as its numeric value).
const statusStyles: Record<OrderStatus, { label: string; className: string }> = {
  1: { label: 'Draft', className: 'bg-gray-100 text-gray-600' },
  2: { label: 'Pending', className: 'bg-amber-100 text-amber-700' },
  3: { label: 'Completed', className: 'bg-green-100 text-green-700' },
  4: { label: 'Cancelled', className: 'bg-red-100 text-red-700' },
}

function orderTotal(order: OrderModel) {
  return order.orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

function itemCount(order: OrderModel) {
  return order.orderItems.reduce((sum, item) => sum + item.quantity, 0)
}

export function Orders() {
  const { data: orders, isLoading, isError, refetch } = useOrders()

  if (isLoading) {
    return (
      <section>
        <h1 className="mb-6 text-2xl font-semibold tracking-tight text-gray-900">Your orders</h1>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-lg border border-gray-200 bg-white" />
          ))}
        </div>
      </section>
    )
  }

  if (isError) {
    return (
      <ErrorState
        message="We couldn't load your orders. Please try again."
        onRetry={() => refetch()}
      />
    )
  }

  const items = orders?.data ?? []

  if (items.length === 0) {
    return (
      <section className="py-16 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">No orders yet</h1>
        <p className="mt-2 text-sm text-gray-500">Your placed orders will appear here.</p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
        >
          Start shopping
        </Link>
      </section>
    )
  }

  return (
    <section>
      <h1 className="mb-6 text-2xl font-semibold tracking-tight text-gray-900">Your orders</h1>

      <ul className="space-y-3">
        {items.map((order) => {
          const status = statusStyles[order.status] ?? statusStyles[1]
          const count = itemCount(order)

          return (
            <li
              key={order.id}
              className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white p-4"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-medium text-gray-900">{order.orderName}</p>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${status.className}`}
                  >
                    {status.label}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-gray-500">
                  {count} {count === 1 ? 'item' : 'items'}
                </p>
              </div>
              <p className="shrink-0 text-sm font-semibold text-gray-900">
                {priceFormatter.format(orderTotal(order))}
              </p>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
