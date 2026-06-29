import type { PaginatedResult } from '../common/paginated-result'
import type { OrderModel } from './order-model'

export type GetOrdersResponse = {
  orders: PaginatedResult<OrderModel>
}

export type GetOrdersByNameResponse = {
  orders: OrderModel[]
}

export type GetOrdersByCustomerResponse = {
  orders: OrderModel[]
}

export type CreateOrderResponse = {
  id: string
}

export type UpdateOrderResponse = {
  isSuccess: boolean
}

export type DeleteOrderResponse = {
  isSuccess: boolean
}
