import { useApiMutation } from "@/shared/composables/useApiMutation";
import { useQueryClient } from "@tanstack/vue-query";
import type { PaymentRequestId } from "@/shared/types/brand.types";
import { apAdapter } from "../../infrastructure/ap_adapter";
import { apKeys } from "../keys";

/**
 * Use Case: Approve a Payment Request.
 *
 * Initiates the approval transition for a pending payment request.
 * Invalidates relevant query keys on success.
 *
 * @param id - The unique identifier of the payment request to approve.
 * @returns Reactive approval state and mutate function.
 * @example
 * const { approve, isPending } = useApprovePaymentRequest(toId<PaymentRequestId>('pr_123'))
 */
export function useApprovePaymentRequest(id: PaymentRequestId) {
  const queryClient = useQueryClient();

  const {
    mutateAsync: approve,
    isPending,
    error,
  } = useApiMutation<void>(
    async () => {
      await apAdapter.approveRequest(id);
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

  return { approve, isPending, error };
}
