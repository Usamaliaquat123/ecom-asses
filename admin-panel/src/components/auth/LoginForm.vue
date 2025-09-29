<script setup lang="ts">
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Eye, EyeOff, Shield, Loader2 } from 'lucide-vue-next'

const authStore = useAuthStore()
const router = useRouter()
const showPassword = ref(false)
const loginError = ref('')

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required')
})

const { defineField, handleSubmit, errors } = useForm({
  validationSchema: schema,
  initialValues: {
    email: 'admin@example.com',
    password: 'password123'
  }
})

const [email, emailAttrs] = defineField('email')
const [password, passwordAttrs] = defineField('password')

const handleLogin = async () => {
  loginError.value = ''
  
  try {
    const values = { email: email.value, password: password.value }
    const result = await authStore.login(values)
    if (result.success) {
      // Navigate to dashboard on successful login
      await router.push('/')
    } else {
      loginError.value = result.error || 'Login failed'
    }
  } catch (error: any) {
    loginError.value = error.message || 'Login failed'
    console.error('Login failed:', error)
  }
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}
</script>

<template>
  <div class="min-h-screen flex">
    <!-- Left Side - Login Form -->
    <div class="flex-1 flex items-center justify-center bg-white px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <!-- Header -->
        <div class="text-center">
          <div class="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-purple-600 shadow-lg">
            <Shield class="h-8 w-8 text-white" />
          </div>
          <h2 class="mt-6 text-3xl font-bold text-gray-900">
            Sign in to Admin Panel
          </h2>
          <p class="mt-2 text-sm text-gray-600">
            Access your dashboard and manage your system
          </p>
        </div>

        <!-- Login Form -->
        <div class="space-y-6">
          <div class="space-y-6">
            <!-- Email -->
            <div>
              <input
                id="email"
                v-model="email"
                v-bind="emailAttrs"
                type="email"
                autocomplete="email"
                :class="[
                  'input w-full',
                  errors.email ? 'border-red-300 focus-visible:ring-red-500' : ''
                ]"
                placeholder="Work email"
              >
              <p v-if="errors.email" class="mt-1 text-sm text-red-600">
                {{ errors.email }}
              </p>
            </div>

            <!-- Password -->
            <div>
              <div class="relative">
                <input
                  id="password"
                  v-model="password"
                  v-bind="passwordAttrs"
                  :type="showPassword ? 'text' : 'password'"
                  autocomplete="current-password"
                  :class="[
                    'input w-full pr-10',
                    errors.password ? 'border-red-300 focus-visible:ring-red-500' : ''
                  ]"
                  placeholder="Password"
                >
                <button
                  type="button"
                  @click="togglePasswordVisibility"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <Eye v-if="!showPassword" class="h-4 w-4 text-gray-400" />
                  <EyeOff v-else class="h-4 w-4 text-gray-400" />
                </button>
              </div>
              <p v-if="errors.password" class="mt-1 text-sm text-red-600">
                {{ errors.password }}
              </p>
            </div>

            <!-- Error Message -->
            <div v-if="loginError" class="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p class="text-sm text-red-600">{{ loginError }}</p>
            </div>

            <!-- Login button -->
            <button
              type="button"
              @click="handleLogin"
              :disabled="authStore.isLoading"
              class="btn btn-primary w-full h-12 text-base font-semibold"
            >
              <Loader2 v-if="authStore.isLoading" class="animate-spin h-5 w-5 mr-2" />
              <span v-if="authStore.isLoading">Signing in...</span>
              <span v-else>Sign in</span>
            </button>
          </div>

     

          <!-- Footer Links -->
          <div class="flex items-center justify-center space-x-6 text-xs text-gray-500">
            <a href="#" class="hover:text-gray-700">Privacy Policy</a>
            <a href="#" class="hover:text-gray-700">Terms of Service</a>
            <a href="#" class="hover:text-gray-700">Privacy & Security</a>
          </div>
        </div>

        <!-- Demo credentials -->
        <div class="mt-8 p-4 bg-gray-50 rounded-lg">
          <p class="text-xs text-gray-600 mb-2">Demo credentials:</p>
          <p class="text-xs text-gray-500">Email: admin@example.com</p>
          <p class="text-xs text-gray-500">Password: password123</p>
        </div>
      </div>
    </div>

    <!-- Right Side - Illustration/Branding -->
    <div class="hidden lg:flex flex-1 bg-gradient-to-br from-purple-600 to-blue-600 items-center justify-center p-12">
      <div class="max-w-md text-center text-white">
        <div class="mb-8">
          <div class="w-24 h-24 mx-auto bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mb-6">
            <Shield class="w-12 h-12 text-white" />
          </div>
          <h2 class="text-3xl font-bold mb-4">
            Welcome to Admin Panel
          </h2>
          <p class="text-lg text-purple-100 mb-8">
            Manage your system with powerful tools and intuitive interface. Get insights, control users, and monitor your application performance.
          </p>
        </div>

        <!-- Feature highlights -->
        <div class="space-y-4 text-left">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
            </div>
            <span class="text-purple-100">User Management & Role Control</span>
          </div>
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
            </div>
            <span class="text-purple-100">Real-time Analytics & Reports</span>
          </div>
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
            </div>
            <span class="text-purple-100">Secure & Scalable Architecture</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
