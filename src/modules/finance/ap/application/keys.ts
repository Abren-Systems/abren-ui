/**
 * Query Key Factory for Accounts Payable Module
 *
 * Centralized source of truth for TanStack Query keys.
 */
export const apKeys = {
  all: ['ap'] as const,
  paymentRequests: () => [...apKeys.all, 'payment-requests'] as const,
  paymentRequest: (id: string) => [...apKeys.paymentRequests(), id] as const,
  vendorBills: () => [...apKeys.all, 'vendor-bills'] as const,
  vendorBill: (id: string) => [...apKeys.vendorBills(), id] as const,
}
