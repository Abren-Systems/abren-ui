import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apiGet, httpClient, type ApiResponse } from '@/core/api/http-client'
import { AUTH_KEYS } from '@/core/auth/constants'

/**
 * Auth Store — Shared Cross-Cutting Concern
 *
 * This is the ONLY Pinia store in shared/.
 * It holds identity state consumed by all modules:
 * - Access / refresh tokens
 * - Current user profile
 * - Current tenant context (multi-tenancy)
 * - Tenant feature flags (mirrors backend FeatureGate)
 */

const USER_KEY = 'abren_current_user'
const TENANT_KEY = 'abren_current_tenant'

function readStoredJson<T>(key: string): T | null {
  const raw = sessionStorage.getItem(key)
  if (!raw) return null

  try {
    return JSON.parse(raw) as T
  } catch {
    sessionStorage.removeItem(key)
    return null
  }
}

// ── Types ─────────────────────────────────────────────
export interface CurrentUser {
  id: string
  tenantId: string
  email: string
  isActive: boolean
}

export interface TenantInfo {
  id: string
  name: string
  features: Record<string, boolean>
}

interface LoginTokenPayload {
  access_token: string
  refresh_token?: string | null
  token_type: string
}

interface UserProfileResponse {
  id: string
  tenant_id: string
  email: string
  is_active: boolean
}

// ── Store ─────────────────────────────────────────────
export const useAuthStore = defineStore('auth', () => {
  // ── State ──────────────────────────────────────────
  const token = ref<string | null>(sessionStorage.getItem(AUTH_KEYS.ACCESS_TOKEN))
  const refreshToken = ref<string | null>(sessionStorage.getItem(AUTH_KEYS.REFRESH_TOKEN))
  const currentUser = ref<CurrentUser | null>(readStoredJson<CurrentUser>(USER_KEY))
  const currentTenant = ref<TenantInfo | null>(readStoredJson<TenantInfo>(TENANT_KEY))

  // ── Computed ───────────────────────────────────────
  const isAuthenticated = computed(() => !!token.value)
  const hasSessionContext = computed(() => !!currentUser.value && !!currentTenant.value)
  const tenantFeatures = computed(() => currentTenant.value?.features ?? {})

  // ── Actions ────────────────────────────────────────
  function persistState() {
    if (token.value) {
      sessionStorage.setItem(AUTH_KEYS.ACCESS_TOKEN, token.value)
    } else {
      sessionStorage.removeItem(AUTH_KEYS.ACCESS_TOKEN)
    }

    if (refreshToken.value) {
      sessionStorage.setItem(AUTH_KEYS.REFRESH_TOKEN, refreshToken.value)
    } else {
      sessionStorage.removeItem(AUTH_KEYS.REFRESH_TOKEN)
    }

    if (currentUser.value) {
      sessionStorage.setItem(USER_KEY, JSON.stringify(currentUser.value))
    } else {
      sessionStorage.removeItem(USER_KEY)
    }

    if (currentTenant.value) {
      sessionStorage.setItem(TENANT_KEY, JSON.stringify(currentTenant.value))
    } else {
      sessionStorage.removeItem(TENANT_KEY)
    }
  }

  function setSession(
    newToken: string,
    newRefreshToken: string | null,
    user: CurrentUser,
    tenant: TenantInfo,
  ) {
    token.value = newToken
    refreshToken.value = newRefreshToken
    currentUser.value = user
    currentTenant.value = tenant
    persistState()
  }

  function hasFeature(feature: string): boolean {
    return tenantFeatures.value[feature] === true
  }

  async function hydrateSession(): Promise<boolean> {
    if (!token.value) return false

    try {
      const [userProfile, tenant] = await Promise.all([
        apiGet<UserProfileResponse>('/core/users/me'),
        apiGet<TenantInfo>('/core/tenants/current'),
      ])

      currentUser.value = {
        id: userProfile.id,
        tenantId: userProfile.tenant_id,
        email: userProfile.email,
        isActive: userProfile.is_active,
      }
      currentTenant.value = tenant
      persistState()
      return true
    } catch {
      logout()
      return false
    }
  }

  async function login(email: string, password: string): Promise<void> {
    const formData = new URLSearchParams()
    formData.set('username', email)
    formData.set('password', password)

    const response = await httpClient.post<ApiResponse<LoginTokenPayload>>(
      '/auth/login',
      formData,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    )

    token.value = response.data.data.access_token
    refreshToken.value = response.data.data.refresh_token ?? null
    persistState()

    const hydrated = await hydrateSession()
    if (!hydrated) {
      throw new Error('Authenticated, but failed to load the user session.')
    }
  }

  function logout() {
    token.value = null
    refreshToken.value = null
    currentUser.value = null
    currentTenant.value = null
    persistState()
  }

  function $reset() {
    logout()
  }

  return {
    // State
    token,
    refreshToken,
    currentUser,
    currentTenant,
    // Computed
    isAuthenticated,
    hasSessionContext,
    tenantFeatures,
    // Actions
    setSession,
    hydrateSession,
    login,
    hasFeature,
    logout,
    $reset,
  }
})
