import { apiGet, apiPost } from '@/shared/api/http-client'
import { PendingApprovalSchema } from './schemas'
import type { PendingApprovalDTO, ApprovalActionDTO, ApprovalPolicyCreateDTO } from './api.types'

const BASE = '/workflows'

/**
 * Workflow API Adapter — Gold Standard Implementation.
 *
 * Provides typed HTTP methods for interacting with Approval Workflows.
 * Includes boundary shielding via Zod for pending tasks.
 */
export const workflowsAdapter = {
  /**
   * Fetches all pending approval tasks for the active session.
   */
  async getPendingTasks(): Promise<PendingApprovalDTO[]> {
    const raw = await apiGet<unknown[]>(`${BASE}/approvals/pending`)
    return raw.map((item) => PendingApprovalSchema.parse(item))
  },

  /**
   * Submits a decision (Approve/Reject) for a specific workflow instance.
   */
  async submitDecision(instanceId: string, action: ApprovalActionDTO): Promise<void> {
    await apiPost(`${BASE}/approvals/${instanceId}/actions`, action)
  },

  /**
   * Creates a new workflow routing policy.
   */
  async createPolicy(policy: ApprovalPolicyCreateDTO): Promise<void> {
    await apiPost(`${BASE}/state/policies`, policy)
  },
}
