import type {
  GetProductsResponse,
  GetProductByCategoryResponse,
  GetProductByIdResponse,
} from '../models/catalog/responses'
import type { CreateProductRequest, UpdateProductRequest } from '../models/catalog/requests'

const BASE_URL = `${import.meta.env.VITE_GATEWAY_URL ?? 'http://localhost:6004'}/catalog-service`

async function request<T>(input: string, init?: RequestInit): Promise<T> {
  const res = await fetch(input, init)
  if (!res.ok) throw new Error(`${init?.method ?? 'GET'} ${input} failed: ${res.status}`)
  return res.json() as Promise<T>
}

export function getProducts(pageNumber = 1, pageSize = 10): Promise<GetProductsResponse> {
  return request(`${BASE_URL}/products?PageNumber=${pageNumber}&PageSize=${pageSize}`)
}

export function getProductById(id: string): Promise<GetProductByIdResponse> {
  return request(`${BASE_URL}/products/${id}`)
}

export function getProductByCategory(category: string): Promise<GetProductByCategoryResponse> {
  return request(`${BASE_URL}/products/category/${encodeURIComponent(category)}`)
}

export function createProduct(body: CreateProductRequest): Promise<{ id: string }> {
  return request(`${BASE_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

export function updateProduct(body: UpdateProductRequest): Promise<{ isSuccess: boolean }> {
  return request(`${BASE_URL}/products`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

export function deleteProduct(id: string): Promise<{ isSuccess: boolean }> {
  return request(`${BASE_URL}/products/${id}`, { method: 'DELETE' })
}
