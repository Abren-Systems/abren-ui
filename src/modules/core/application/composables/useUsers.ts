import { useResourceQuery } from '@/shared/composables/useResourceQuery'
import { coreAdapter } from '../../infrastructure/core_adapter'
import { CoreMapper } from '../../infrastructure/mappers'
import { coreKeys } from '../keys'

/**
 * Use Case: View Tenant Users.
 *
 * Fetches the list of users and maps them to domain entities.
 *
 * @returns Reactive list of users and loading state.
 * @example
 * const { users, isLoading } = useUsers()
 */
export function useUsers() {
  const {
    data: users,
    isLoading,
    error,
    refetch,
  } = useResourceQuery(
    coreKeys.users(),
    () => coreAdapter.listUsers(),
    (dtos) => dtos.map((dto) => CoreMapper.toUser(dto)),
    { staleTime: 1000 * 60 * 5 }, // 5 minutes
  )

  return {
    users,
    isLoading,
    error,
    refresh: refetch,
  }
}
