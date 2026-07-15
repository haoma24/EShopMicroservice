// Shared TanStack Query keys for state used across features (e.g. the basket is
// written from add-to-cart and read by the basket page; products are listed on
// the home page and read individually on the detail page).
export const basketKeys = {
  all: ['basket'] as const,
  detail: (userName: string) => [...basketKeys.all, userName] as const,
}

export const productKeys = {
  all: ['products'] as const,
  list: (pageNumber: number, pageSize: number) =>
    [...productKeys.all, 'list', { pageNumber, pageSize }] as const,
  detail: (id: string) => [...productKeys.all, 'detail', id] as const,
}

export const orderKeys = {
  all: ['orders'] as const,
  list: (pageIndex: number, pageSize: number) =>
    [...orderKeys.all, 'list', { pageIndex, pageSize }] as const,
}
