<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@/core/ui/button'
import { Input } from '@/core/ui/input'
import { Label } from '@/core/ui/label'

const router = useRouter()
const email = ref('')
const password = ref('')
const isLoading = ref(false)

async function handleLogin() {
  isLoading.value = true
  try {
    // TODO: Connect to auth store
    console.log('Logging in with:', email.value)
    await new Promise(resolve => setTimeout(resolve, 1000))
    router.push('/app')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-neutral-50 px-4 py-12 sm:px-6 lg:px-8">
    <div class="w-full max-w-md space-y-8 rounded-xl border border-neutral-200 bg-white p-8 shadow-lg backdrop-blur-sm">
      <div class="text-center">
        <h2 class="mt-6 text-3xl font-bold tracking-tight text-neutral-900">
          Abren ERP
        </h2>
        <p class="mt-2 text-sm text-neutral-600">
          Sign in to your financial operating system
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="space-y-4">
          <div class="space-y-2">
            <Label for="email">Email address</Label>
            <Input
              id="email"
              v-model="email"
              type="email"
              required
              placeholder="name@company.com"
            />
          </div>
          <div class="space-y-2">
            <Label for="password">Password</Label>
            <Input
              id="password"
              v-model="password"
              type="password"
              required
              placeholder="••••••••"
            />
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              class="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
            >
            <label for="remember-me" class="ml-2 block text-sm text-neutral-900">
              Remember me
            </label>
          </div>

          <div class="text-sm">
            <a href="#" class="font-medium text-primary-600 hover:text-primary-500">
              Forgot your password?
            </a>
          </div>
        </div>

        <Button
          type="submit"
          class="w-full"
          :disabled="isLoading"
        >
          <template v-if="isLoading">
            Signing in...
          </template>
          <template v-else>
            Sign in
          </template>
        </Button>
      </form>
    </div>
  </div>
</template>
