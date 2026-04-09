import { useApiQuery } from "@/shared/composables/useApiQuery";
import type { PaymentRequestId } from "@/shared/types/brand.types";
import { apAdapter } from "../../infrastructure/ap_adapter";
import { APMapper } from "../../infrastructure/mappers";
import { apKeys } from "../keys";

/**
 * Use Case: View a Single Payment Request.
 *
 * Fetches and maps a specific payment request by ID.
 *
 * @param id - The unique identifier of the payment request.
 * @returns Reactive payment request state.
 * @example
 * const { request, isLoading } = usePaymentRequest(toId<PaymentRequestId>('pr_123'))
 */
export function usePaymentRequest(id: PaymentRequestId) {
  const {
    data: request,
    isLoading,
    error,
  } = useApiQuery(
    apKeys.paymentRequest(id),
    async () => {
      const dto = await apAdapter.getRequest(id);
      return APMapper.toPaymentRequest(dto);
    },
    { staleTime: 1000 * 30 }, // 30 seconds
  );

  return { request, isLoading, error };
}
