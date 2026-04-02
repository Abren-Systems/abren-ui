/**
 * Query Key Factory for Core Module
 *
 * Centralized source of truth for TanStack Query keys.
 */
export const coreKeys = {
  all: ['core'] as const,
  users: () => [...coreKeys.all, 'users'] as const,
}
