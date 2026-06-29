import type {
  GetBasketResponse,
  StoreBasketResponse,
  CheckoutBasketResponse,
  DeleteBasketResponse,
} from '../models/basket/responses'
import type { StoreBasketRequest, CheckoutBasketRequest } from '../models/basket/requests'

const BASE_URL = `${import.meta.env.VITE_GATEWAY_URL ?? 'http://localhost:6004'}/basket-service`

async function request<T>(input: string, init?: RequestInit): Promise<T> {
  const res = await fetch(input, init)
  if (!res.ok) throw new Error(`${init?.method ?? 'GET'} ${input} failed: ${res.status}`)
  return res.json() as Promise<T>
}

export function getBasket(userName: string): Promise<GetBasketResponse> {
  return request(`${BASE_URL}/basket/${encodeURIComponent(userName)}`)
}

export function storeBasket(body: StoreBasketRequest): Promise<StoreBasketResponse> {
  return request(`${BASE_URL}/basket`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

export function deleteBasket(userName: string): Promise<DeleteBasketResponse> {
  return request(`${BASE_URL}/basket/${encodeURIComponent(userName)}`, { method: 'DELETE' })
}

export function checkoutBasket(body: CheckoutBasketRequest): Promise<CheckoutBasketResponse> {
  return request(`${BASE_URL}/basket/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}
