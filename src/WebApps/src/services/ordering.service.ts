import type {
  GetOrdersResponse,
  GetOrdersByNameResponse,
  GetOrdersByCustomerResponse,
  CreateOrderResponse,
  UpdateOrderResponse,
  DeleteOrderResponse,
} from '../models/ordering/responses'
import type { CreateOrderRequest, UpdateOrderRequest } from '../models/ordering/requests'

const BASE_URL = `${import.meta.env.VITE_GATEWAY_URL ?? 'http://localhost:6004'}/ordering-service`

async function request<T>(input: string, init?: RequestInit): Promise<T> {
  const res = await fetch(input, init)
  if (!res.ok) throw new Error(`${init?.method ?? 'GET'} ${input} failed: ${res.status}`)
  return res.json() as Promise<T>
}

// PageIndex is zero-based to match the ordering API (first page = 0).
export function getOrders(pageIndex = 0, pageSize = 10): Promise<GetOrdersResponse> {
  return request(`${BASE_URL}/orders?PageIndex=${pageIndex}&PageSize=${pageSize}`)
}

export function getOrdersByName(name: string): Promise<GetOrdersByNameResponse> {
  return request(`${BASE_URL}/orders/byname/${encodeURIComponent(name)}`)
}

export function getOrdersByCustomer(customerId: string): Promise<GetOrdersByCustomerResponse> {
  return request(`${BASE_URL}/orders/bycustomer/${customerId}`)
}

export function createOrder(body: CreateOrderRequest): Promise<CreateOrderResponse> {
  return request(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

export function updateOrder(id: string, body: UpdateOrderRequest): Promise<UpdateOrderResponse> {
  return request(`${BASE_URL}/orders/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

export function deleteOrder(id: string): Promise<DeleteOrderResponse> {
  return request(`${BASE_URL}/orders/${id}`, { method: 'DELETE' })
}
