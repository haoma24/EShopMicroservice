import type { PaginatedResult } from '../common/paginated-result.ts'
import type { OrderModel } from './order-model.ts'

export type GetOrdersResponse = {
  orders: PaginatedResult<OrderModel>
}
