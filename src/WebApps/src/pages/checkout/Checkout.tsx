import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ErrorState } from '@/components/ErrorState'
import { useBasket } from '@/hooks/useBasket'
import { DEFAULT_CUSTOMER_ID, DEFAULT_USER_NAME } from '@/lib/constants'
import type { CheckoutBasketRequest } from '@/models/basket/requests'
import { useCheckout } from './hooks/useCheckout'

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

// Prefilled demo values so the flow is testable in one click (no auth yet).
const initialForm = {
  firstName: 'John',
  lastName: 'Doe',
  emailAddress: 'john.doe@example.com',
  addressLine: '123 Main St',
  country: 'USA',
  state: 'CA',
  zipCode: '90001',
  cardName: 'John Doe',
  cardNumber: '4111111111111111',
  expiration: '12/30',
  cvv: '123',
}

type FormField = keyof typeof initialForm

const fields: { name: FormField; label: string; group: string; type?: string }[] = [
  { name: 'firstName', label: 'First name', group: 'Contact' },
  { name: 'lastName', label: 'Last name', group: 'Contact' },
  { name: 'emailAddress', label: 'Email', group: 'Contact', type: 'email' },
  { name: 'addressLine', label: 'Address', group: 'Shipping' },
  { name: 'country', label: 'Country', group: 'Shipping' },
  { name: 'state', label: 'State', group: 'Shipping' },
  { name: 'zipCode', label: 'ZIP code', group: 'Shipping' },
  { name: 'cardName', label: 'Name on card', group: 'Payment' },
  { name: 'cardNumber', label: 'Card number', group: 'Payment' },
  { name: 'expiration', label: 'Expiration (MM/YY)', group: 'Payment' },
  { name: 'cvv', label: 'CVV', group: 'Payment' },
]

const groups = ['Contact', 'Shipping', 'Payment']

export function Checkout() {
  const navigate = useNavigate()
  const { data: cart, isLoading, isError, refetch } = useBasket()
  const checkout = useCheckout()
  const [form, setForm] = useState(initialForm)

  const items = cart?.items ?? []
  const total = cart?.totalPrice ?? items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  if (isLoading) {
    return <div className="h-96 animate-pulse rounded-lg bg-gray-200" />
  }

  if (isError) {
    return (
      <ErrorState
        message="We couldn't load your basket for checkout. Please try again."
        onRetry={() => refetch()}
      />
    )
  }

  if (items.length === 0) {
    return (
      <section className="py-16 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          Nothing to check out
        </h1>
        <p className="mt-2 text-sm text-gray-500">Your basket is empty.</p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
        >
          Continue shopping
        </Link>
      </section>
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const request: CheckoutBasketRequest = {
      userName: DEFAULT_USER_NAME,
      customerId: DEFAULT_CUSTOMER_ID,
      ...form,
      paymentMethod: 1,
    }

    checkout.mutate(request, {
      onSuccess: (res) => {
        if (res.isSuccess) {
          navigate('/order-submitted', {
            replace: true,
            state: {
              name: `${form.firstName} ${form.lastName}`.trim(),
              emailAddress: form.emailAddress,
              total,
            },
          })
        }
      },
    })
  }

  const checkoutFailed = checkout.isError || (checkout.isSuccess && !checkout.data?.isSuccess)

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold tracking-tight text-gray-900">Checkout</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8 lg:col-span-2">
          {groups.map((group) => (
            <fieldset key={group} className="rounded-lg border border-gray-200 bg-white p-5">
              <legend className="px-1 text-sm font-semibold text-gray-900">{group}</legend>
              <div className="mt-2 grid gap-4 sm:grid-cols-2">
                {fields
                  .filter((f) => f.group === group)
                  .map((f) => (
                    <label key={f.name} className="flex flex-col gap-1 text-sm">
                      <span className="font-medium text-gray-700">{f.label}</span>
                      <input
                        type={f.type ?? 'text'}
                        required
                        value={form[f.name]}
                        onChange={(e) => setForm((prev) => ({ ...prev, [f.name]: e.target.value }))}
                        className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                      />
                    </label>
                  ))}
              </div>
            </fieldset>
          ))}
        </form>

        <aside className="h-fit rounded-lg border border-gray-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-gray-900">Order summary</h2>
          <ul className="mt-4 space-y-3">
            {items.map((item) => (
              <li key={`${item.productId}-${item.color}`} className="flex justify-between gap-3 text-sm">
                <span className="min-w-0 truncate text-gray-600">
                  {item.productName} × {item.quantity}
                </span>
                <span className="shrink-0 font-medium text-gray-900">
                  {priceFormatter.format(item.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-gray-200 pt-4">
            <span className="text-base font-medium text-gray-900">Total</span>
            <span className="text-lg font-semibold text-gray-900">
              {priceFormatter.format(total)}
            </span>
          </div>

          <button
            type="submit"
            form="checkout-form"
            disabled={checkout.isPending}
            className="mt-6 w-full rounded-md bg-gray-900 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {checkout.isPending ? 'Placing order…' : 'Place order'}
          </button>

          {checkoutFailed && (
            <p className="mt-2 text-xs text-red-600">
              Checkout failed. Please review your details and try again.
            </p>
          )}
        </aside>
      </div>
    </div>
  )
}
