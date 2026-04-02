import { useApiMutation } from '@/shared/composables/useApiMutation'
import { useQueryClient } from '@tanstack/vue-query'
import { apAdapter } from '../../infrastructure/ap_adapter'
import type { PaymentRequestPayDTO } from '../../infrastructure/api.types'
import { apKeys } from '../keys'
import type { ApiError } from '@/shared/api/http-client'

/**
 * Use Case: Pay a Payment Request.
 *
 * @param id - The unique identifier of the payment request to pay.
 */
export function usePayPaymentRequest(id: string) {
  const queryClient = useQueryClient()

  const {
    mutateAsync: pay,
    isPending,
    error,
  } = useApiMutation<void, ApiError, PaymentRequestPayDTO>(
    async (dto: PaymentRequestPayDTO) => {
      await apAdapter.payRequest(id, dto)
    },
    {
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: apKeys.paymentRequest(id) })
        void queryClient.invalidateQueries({ queryKey: apKeys.paymentRequests() })
      },
    },
  )

  return { pay, isPending, error }
}
