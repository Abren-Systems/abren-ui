import { CommonMapper } from '@/shared/infrastructure/mappers'
import { type UserId, type TenantId } from '@/shared/types/brand.types'
import type { User, UserStatus } from '../domain/user.types'
import type { UserDTO } from './api.types'

/**
 * Core Domain Mapper.
 *
 * Handles common transformations for the platform engine (Users, Tenants).
 */
export class CoreMapper {
  /**
   * Transforms a raw API user response into a Domain User entity.
   */
  static toUser(dto: UserDTO): User {
    return {
      id: CommonMapper.toBrandedId<UserId>(dto.id),
      email: dto.email,
      role: dto.role || 'User',
      status: (dto.status as UserStatus) || 'Active',
      tenantId: CommonMapper.toBrandedId<TenantId>(dto.tenant_id),
      lastLoginAt: CommonMapper.toDate(dto.last_login_at),
    }
  }
}
