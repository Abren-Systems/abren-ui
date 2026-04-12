import type { FieldApi } from "@tanstack/vue-form";
import type { ApiError } from "@/shared/api/http-client";

/**
 * useFormErrorHandler — Error Contract Adapter for TanStack Form.
 *
 * Consumes the structured `ApiError.details` array produced by the backend
 * Error Contract and maps each field-level error into the corresponding
 * TanStack Form field's error state.
 *
 * Usage inside a mutation's `onError` callback:
 * ```ts
 * import { useFormErrorHandler } from "@/shared/composables/useFormErrorHandler";
 *
 * const { applyErrors } = useFormErrorHandler(form);
 *
 * const { mutateAsync } = useApiMutation(fn, {
 *   onError: (err: ApiError) => applyErrors(err),
 * });
 * ```
 */
export function useFormErrorHandler(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: { setFieldMeta: (field: string, updater: (meta: any) => any) => void },
) {
  /**
   * Applies all field-level errors from an `ApiError` into the form's
   * field metadata. Unknown/non-field errors are returned for the caller
   * to display as a top-level alert.
   *
   * @param error - The `ApiError` thrown by the http-client interceptor.
   * @returns Non-field errors that should be displayed at the form level.
   */
  function applyErrors(error: ApiError): string[] {
    const nonFieldErrors: string[] = [];

    if (!error.details || error.details.length === 0) {
      nonFieldErrors.push(error.message);
      return nonFieldErrors;
    }

    for (const detail of error.details) {
      if (detail.field) {
        form.setFieldMeta(detail.field, (meta) => ({
          ...meta,
          errors: [detail.message],
          errorMap: { onChange: detail.message },
        }));
      } else {
        nonFieldErrors.push(detail.message);
      }
    }

    return nonFieldErrors;
  }

  return { applyErrors };
}
