import { useApiMutation } from "@/shared/composables/useApiMutation";
import { useQueryClient } from "@tanstack/vue-query";
import { apAdapter } from "../../infrastructure/ap_adapter";
import type { PaymentRequestRejectDTO } from "../../infrastructure/api.types";
import { apKeys } from "../keys";
import type { ApiError } from "@/shared/api/http-client";
import type { PaymentRequestId } from "@/shared/types/brand.types";

/**
 * Use Case: Reject a Payment Request.
 *
 * @param id - The unique identifier of the payment request to reject.
 * @returns Mutation state and reject function.
 * @example
 * const { reject, isPending } = useRejectPaymentRequest(toId<PaymentRequestId>('pr_123'))
 */
export function useRejectPaymentRequest(id: PaymentRequestId) {
  const queryClient = useQueryClient();

  const {
    mutateAsync: reject,
    isPending,
    error,
  } = useApiMutation<void, ApiError, string>(
    async (reason: string) => {
      const dto: PaymentRequestRejectDTO = { reason };
      await apAdapter.rejectRequest(id, dto);
    },
    {
      onSuccess: () => {
        void queryClient.invalidateQueries({
          queryKey: apKeys.paymentRequest(id),
        });
        void queryClient.invalidateQueries({
          queryKey: apKeys.paymentRequests(),
        });
      },
    },
  );

  return { reject, isPending, error };
}
