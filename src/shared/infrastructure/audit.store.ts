import { defineStore } from 'pinia'
import { ref } from 'vue'
import { eventBus } from '../event-bus/event-bus'
import type { AppEvent } from '../event-bus/event-bus'

/**
 * Volatile Audit Store — Global Activity Tracking
 *
 * Intercepts all high-integrity cross-module events and maintains
 * a chronological log of user and system activity.
 */
export const useAuditStore = defineStore('audit', () => {
  const activityLog = ref<AppEvent<unknown>[]>([])
  const maxLogSize = 50

  /**
   * Start global interception of module events.
   * Typically called in the App Shell or a top-level provider.
   */
  function initialize() {
    // We listen to everything — used for "Recent Activity" feeds
    // In a real app, you might filter by specific event types
    eventBus.on('payment-request:submitted', logEvent)
    eventBus.on('payment-request:approved', logEvent)
    eventBus.on('payment-request:rejected', logEvent)
    eventBus.on('payment-request:paid', logEvent)
    eventBus.on('journal-entry:posted', logEvent)
  }

  function logEvent(event: AppEvent<unknown>) {
    activityLog.value.unshift(event)

    // Maintain a reasonable buffer size
    if (activityLog.value.length > maxLogSize) {
      activityLog.value.pop()
    }

    console.info(`[Audit] ${event.metadata.sourceModule} emitted ${event.metadata.id}`)
  }

  return {
    activityLog,
    initialize,
  }
})
