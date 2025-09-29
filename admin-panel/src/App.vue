<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import AppLayout from '@/components/layout/AppLayout.vue'
import LoginForm from '@/components/auth/LoginForm.vue'

const authStore = useAuthStore()

onMounted(() => {
  authStore.initializeAuth()
})
</script>

<template>
  <div id="app">
    <LoginForm v-if="!authStore.isAuthenticated" />
    <AppLayout v-else>
      <RouterView />
    </AppLayout>
  </div>
</template>