import { useApiMutation } from '@/shared/composables/useApiMutation'
import { useQueryClient } from '@tanstack/vue-query'
import { apAdapter } from '../../infrastructure/ap_adapter'
import type { PaymentRequestRejectDTO } from '../../infrastructure/api.types'
import { apKeys } from '../keys'
import type { ApiError } from '@/shared/api/http-client'

/**
 * Use Case: Reject a Payment Request.
 *
 * @param id - The unique identifier of the payment request to reject.
 */
export function useRejectPaymentRequest(id: string) {
  const queryClient = useQueryClient()

  const {
    mutateAsync: reject,
    isPending,
    error,
  } = useApiMutation<void, ApiError, string>(
    async (reason: string) => {
      const dto: PaymentRequestRejectDTO = { reason }
      await apAdapter.rejectRequest(id, dto)
    },
    {
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: apKeys.paymentRequest(id) })
        void queryClient.invalidateQueries({ queryKey: apKeys.paymentRequests() })
      },
    },
  )

  return { reject, isPending, error }
}
