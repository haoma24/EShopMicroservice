import { useMutation, useQueryClient } from '@tanstack/react-query'
import { checkoutBasket } from '@/services/basket.service'
import type { CheckoutBasketRequest } from '@/models/basket/requests'
import { basketKeys } from '@/lib/query-keys'

// Posts the checkout. The basket service publishes an order event and deletes
// the basket, so we drop the cached basket on success.
export function useCheckout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: CheckoutBasketRequest) => checkoutBasket(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: basketKeys.all })
    },
  })
}
