import { useApiMutation } from '@/shared/composables/useApiMutation'
import { useQueryClient } from '@tanstack/vue-query'
import { apAdapter } from '../../infrastructure/ap_adapter'
import { apKeys } from '../keys'
import type { ApiError } from '@/shared/api/http-client'

/**
 * Use Case: Validate (Audit) a Vendor Bill.
 *
 * @param id - The bill ID.
 */
export function useValidateVendorBill(id: string) {
  const queryClient = useQueryClient()

  const {
    mutateAsync: validate,
    isPending,
    error,
  } = useApiMutation<void, ApiError, void>(
    async () => {
      await apAdapter.validateBill(id)
    },
    {
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: apKeys.vendorBill(id) })
        void queryClient.invalidateQueries({ queryKey: apKeys.vendorBills() })
      },
    },
  )

  return { validate, isPending, error }
}
