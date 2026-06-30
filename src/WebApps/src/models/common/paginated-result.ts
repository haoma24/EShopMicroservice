// Mirrors BuildingBlocks.Pagination.PaginatedResult<TEntity>
export type PaginatedResult<T> = {
  pageIndex: number
  pageSize: number
  count: number
  data: T[]
}
