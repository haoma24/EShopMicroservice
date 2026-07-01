import { Link, useLocation } from 'react-router-dom'

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

type OrderSubmittedState = {
  name?: string
  emailAddress?: string
  total?: number
}

export function OrderSubmitted() {
  const location = useLocation()
  const state = (location.state ?? {}) as OrderSubmittedState

  return (
    <section className="mx-auto max-w-lg py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
        <svg
          className="h-8 w-8 text-green-600"
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
      </div>

      <h1 className="mt-6 text-2xl font-semibold tracking-tight text-gray-900">
        Thank you{state.name ? `, ${state.name}` : ''}!
      </h1>
      <p className="mt-2 text-sm text-gray-500">
        Your order has been submitted and is being processed.
        {state.emailAddress ? ` A confirmation will be sent to ${state.emailAddress}.` : ''}
      </p>

      {typeof state.total === 'number' && (
        <p className="mt-4 text-base font-medium text-gray-900">
          Order total: {priceFormatter.format(state.total)}
        </p>
      )}

      <Link
        to="/"
        className="mt-8 inline-block rounded-md bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-gray-700"
      >
        Continue shopping
      </Link>
    </section>
  )
}
