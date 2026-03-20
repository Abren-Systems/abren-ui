import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'
import PrimeVue from 'primevue/config'

import App from './App.vue'
import { router } from './app/router'

import './assets/main.css'

const app = createApp(App)

// ── State Management ──────────────────────────────────
app.use(createPinia())

// ── Server State (TanStack Query) ─────────────────────
app.use(VueQueryPlugin, {
  queryClientConfig: {
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,    // 5 minutes
        retry: 1,
        refetchOnWindowFocus: false,  // ERP: don't surprise users with refetches
      },
    },
  },
})

// ── PrimeVue (Unstyled / Volt mode) ───────────────────
app.use(PrimeVue, {
  unstyled: true,
})

// ── Router ────────────────────────────────────────────
app.use(router)

app.mount('#app')
