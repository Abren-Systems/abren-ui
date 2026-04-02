import { useApiQuery } from '@/shared/composables/useApiQuery'
import { apAdapter } from '../../infrastructure/ap_adapter'
import { APMapper } from '../../infrastructure/mappers'
import { apKeys } from '../keys'

/**
 * Use Case: View Payment Requests List.
 *
 * Fetches and maps all standalone payment requests.
 *
 * @returns Reactive payment requests collection and refetch function.
 * @example
 * const { requests, isLoading } = usePaymentRequests()
 */
export function usePaymentRequests() {
  const {
    data: requests,
    isLoading,
    error,
    refetch,
  } = useApiQuery(
    apKeys.paymentRequests(),
    async () => {
      const dtos = await apAdapter.listRequests()
      return dtos.map((dto) => APMapper.toPaymentRequest(dto))
    },
    { staleTime: 1000 * 60 }, // 1 minute
  )

  return { requests, isLoading, error, refetch }
}
