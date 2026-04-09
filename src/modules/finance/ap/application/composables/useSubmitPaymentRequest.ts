import { useApiMutation } from "@/shared/composables/useApiMutation";
import { useQueryClient } from "@tanstack/vue-query";
import { apAdapter } from "../../infrastructure/ap_adapter";
import { apKeys } from "../keys";
import type { PaymentRequestId } from "@/shared/types/brand.types";

/**
 * Use Case: Submit a Payment Request for Approval.
 *
 * Transitions a draft payment request to the submitted state,
 * initiating the workflow.
 *
 * @param id - The unique identifier of the payment request to submit.
 * @returns Reactive submission state and mutate function.
 * @example
 * const { submit, isPending } = useSubmitPaymentRequest(toId<PaymentRequestId>('pr_123'))
 */
export function useSubmitPaymentRequest(id: PaymentRequestId) {
  const queryClient = useQueryClient();

  const {
    mutateAsync: submit,
    isPending,
    error,
  } = useApiMutation<void>(
    async () => {
      await apAdapter.submitRequest(id);
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

  return { submit, isPending, error };
}
