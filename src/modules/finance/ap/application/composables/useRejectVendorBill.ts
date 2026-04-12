import { useMutation, useQueryClient } from '@tanstack/vue-query'
import type { Ref } from 'vue'
import { toValue } from 'vue'
import { apAdapter } from '../../infrastructure/ap_adapter'
import { apKeys } from './keys'
import { useToasts } from '@/shared/components/toast/use-toasts'
import type { VendorBillDTO } from '../../infrastructure/api.types'

export function useRejectVendorBill(id: string | Ref<string>) {
  const queryClient = useQueryClient()
  const { addToast } = useToasts()

  const mutation = useMutation({
    mutationFn: (reason: string) => apAdapter.rejectBill(toValue(id), reason),
    onSuccess: (updatedBill: VendorBillDTO) => {
      // Update individual cache
      queryClient.setQueryData(apKeys.bill(toValue(id)), updatedBill)
      // Invalidate list to fresh state
      void queryClient.invalidateQueries({ queryKey: apKeys.bills() })

      addToast({
        title: 'Vendor Bill Rejected',
        description: 'The bill has been successfully rejected.',
        variant: 'default',
      })
    },
    onError: (err: any) => {
      addToast({
        title: 'Rejection Failed',
        description: err.detail || 'Could not reject the vendor bill.',
        variant: 'destructive',
      })
    },
  })

  return {
    reject: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
  }
}
