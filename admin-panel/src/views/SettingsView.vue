<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { Save, Settings, Bell, Shield, Palette, Globe } from 'lucide-vue-next'

interface SystemSettings {
  siteName: string
  siteDescription: string
  allowRegistration: boolean
  requireEmailVerification: boolean
  sessionTimeout: number
  maxLoginAttempts: number
  passwordMinLength: number
  passwordRequireSpecialChars: boolean
  enableTwoFactor: boolean
  maintenanceMode: boolean
}

const activeTab = ref('general')
const isLoading = ref(true)
const isSaving = ref(false)

const tabs = [
  { id: 'general', name: 'General', icon: Settings },
  { id: 'security', name: 'Security', icon: Shield },
  { id: 'notifications', name: 'Notifications', icon: Bell },
  { id: 'appearance', name: 'Appearance', icon: Palette },
  { id: 'localization', name: 'Localization', icon: Globe }
]

const schema = yup.object({
  siteName: yup.string().required('Site name is required'),
  siteDescription: yup.string().required('Site description is required'),
  sessionTimeout: yup.number().min(5).max(1440).required('Session timeout is required'),
  maxLoginAttempts: yup.number().min(1).max(10).required('Max login attempts is required'),
  passwordMinLength: yup.number().min(6).max(50).required('Password minimum length is required')
})

const { defineField, handleSubmit, errors } = useForm({
  validationSchema: schema,
  initialValues: {
    siteName: 'Admin Panel',
    siteDescription: 'Configuration and User Management Panel',
    allowRegistration: false,
    requireEmailVerification: true,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    passwordRequireSpecialChars: true,
    enableTwoFactor: true,
    maintenanceMode: false
  }
})

const [siteName, siteNameAttrs] = defineField('siteName')
const [siteDescription, siteDescriptionAttrs] = defineField('siteDescription')
const [allowRegistration, allowRegistrationAttrs] = defineField('allowRegistration')
const [requireEmailVerification, requireEmailVerificationAttrs] = defineField('requireEmailVerification')
const [sessionTimeout, sessionTimeoutAttrs] = defineField('sessionTimeout')
const [maxLoginAttempts, maxLoginAttemptsAttrs] = defineField('maxLoginAttempts')
const [passwordMinLength, passwordMinLengthAttrs] = defineField('passwordMinLength')
const [passwordRequireSpecialChars, passwordRequireSpecialCharsAttrs] = defineField('passwordRequireSpecialChars')
const [enableTwoFactor, enableTwoFactorAttrs] = defineField('enableTwoFactor')
const [maintenanceMode, maintenanceModeAttrs] = defineField('maintenanceMode')

onMounted(async () => {
  // Simulate loading settings
  await new Promise(resolve => setTimeout(resolve, 500))
  isLoading.value = false
})

const onSubmit = handleSubmit(async (values) => {
  isSaving.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('Settings saved:', values)
    // Show success message
  } catch (error) {
    console.error('Failed to save settings:', error)
  } finally {
    isSaving.value = false
  }
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900">System Settings</h1>
      <p class="mt-1 text-sm text-gray-500">
        Configure system-wide settings and preferences
      </p>
    </div>

    <div class="flex flex-col lg:flex-row gap-8">
      <!-- Sidebar Navigation -->
      <div class="lg:w-64 flex-shrink-0">
        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-2">
          <nav class="space-y-1">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors',
                activeTab === tab.id
                  ? 'bg-purple-50 text-purple-700 border border-purple-200'
                  : 'text-gray-700 hover:bg-gray-50'
              ]"
            >
              <component :is="tab.icon" class="w-5 h-5 mr-3" />
              {{ tab.name }}
            </button>
          </nav>
        </div>
      </div>

      <!-- Main Content -->
      <div class="flex-1">
        <div v-if="isLoading" class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div class="animate-pulse space-y-6">
            <div class="h-6 bg-gray-200 rounded w-1/4"></div>
            <div class="space-y-4">
              <div class="h-10 bg-gray-200 rounded"></div>
              <div class="h-10 bg-gray-200 rounded"></div>
              <div class="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>

        <form v-else @submit="onSubmit" class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <!-- General Settings -->
          <div v-if="activeTab === 'general'" class="space-y-6">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-6">General Settings</h3>
              
              <div class="space-y-6">
                <div>
                  <label for="siteName" class="block text-sm font-medium text-gray-700 mb-2">
                    Site Name <span class="text-red-500">*</span>
                  </label>
                  <input
                    id="siteName"
                    v-model="siteName"
                    v-bind="siteNameAttrs"
                    type="text"
                    :class="[
                      'input w-full',
                      errors.siteName ? 'border-red-300 focus-visible:ring-red-500' : ''
                    ]"
                    placeholder="Enter site name"
                  >
                  <p v-if="errors.siteName" class="mt-1 text-sm text-red-600">
                    {{ errors.siteName }}
                  </p>
                </div>

                <div>
                  <label for="siteDescription" class="block text-sm font-medium text-gray-700 mb-2">
                    Site Description <span class="text-red-500">*</span>
                  </label>
                  <textarea
                    id="siteDescription"
                    v-model="siteDescription"
                    v-bind="siteDescriptionAttrs"
                    rows="3"
                    :class="[
                      'input w-full',
                      errors.siteDescription ? 'border-red-300 focus-visible:ring-red-500' : ''
                    ]"
                    placeholder="Enter site description"
                  />
                  <p v-if="errors.siteDescription" class="mt-1 text-sm text-red-600">
                    {{ errors.siteDescription }}
                  </p>
                </div>

                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <div>
                      <label class="text-sm font-medium text-gray-900">Allow User Registration</label>
                      <p class="text-sm text-gray-500">Allow new users to register accounts</p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input
                        v-model="allowRegistration"
                        v-bind="allowRegistrationAttrs"
                        type="checkbox"
                        class="sr-only peer"
                      >
                      <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>

                  <div class="flex items-center justify-between">
                    <div>
                      <label class="text-sm font-medium text-gray-900">Require Email Verification</label>
                      <p class="text-sm text-gray-500">Require users to verify their email address</p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input
                        v-model="requireEmailVerification"
                        v-bind="requireEmailVerificationAttrs"
                        type="checkbox"
                        class="sr-only peer"
                      >
                      <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>

                  <div class="flex items-center justify-between">
                    <div>
                      <label class="text-sm font-medium text-gray-900">Maintenance Mode</label>
                      <p class="text-sm text-gray-500">Put the system in maintenance mode</p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input
                        v-model="maintenanceMode"
                        v-bind="maintenanceModeAttrs"
                        type="checkbox"
                        class="sr-only peer"
                      >
                      <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Security Settings -->
          <div v-if="activeTab === 'security'" class="space-y-6">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-6">Security Settings</h3>
              
              <div class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label for="sessionTimeout" class="block text-sm font-medium text-gray-700 mb-2">
                      Session Timeout (minutes) <span class="text-red-500">*</span>
                    </label>
                    <input
                      id="sessionTimeout"
                      v-model="sessionTimeout"
                      v-bind="sessionTimeoutAttrs"
                      type="number"
                      min="5"
                      max="1440"
                      :class="[
                        'input w-full',
                        errors.sessionTimeout ? 'border-red-300 focus-visible:ring-red-500' : ''
                      ]"
                    >
                    <p v-if="errors.sessionTimeout" class="mt-1 text-sm text-red-600">
                      {{ errors.sessionTimeout }}
                    </p>
                  </div>

                  <div>
                    <label for="maxLoginAttempts" class="block text-sm font-medium text-gray-700 mb-2">
                      Max Login Attempts <span class="text-red-500">*</span>
                    </label>
                    <input
                      id="maxLoginAttempts"
                      v-model="maxLoginAttempts"
                      v-bind="maxLoginAttemptsAttrs"
                      type="number"
                      min="1"
                      max="10"
                      :class="[
                        'input w-full',
                        errors.maxLoginAttempts ? 'border-red-300 focus-visible:ring-red-500' : ''
                      ]"
                    >
                    <p v-if="errors.maxLoginAttempts" class="mt-1 text-sm text-red-600">
                      {{ errors.maxLoginAttempts }}
                    </p>
                  </div>
                </div>

                <div>
                  <label for="passwordMinLength" class="block text-sm font-medium text-gray-700 mb-2">
                    Password Minimum Length <span class="text-red-500">*</span>
                  </label>
                  <input
                    id="passwordMinLength"
                    v-model="passwordMinLength"
                    v-bind="passwordMinLengthAttrs"
                    type="number"
                    min="6"
                    max="50"
                    :class="[
                      'input w-full max-w-xs',
                      errors.passwordMinLength ? 'border-red-300 focus-visible:ring-red-500' : ''
                    ]"
                  >
                  <p v-if="errors.passwordMinLength" class="mt-1 text-sm text-red-600">
                    {{ errors.passwordMinLength }}
                  </p>
                </div>

                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <div>
                      <label class="text-sm font-medium text-gray-900">Require Special Characters</label>
                      <p class="text-sm text-gray-500">Require special characters in passwords</p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input
                        v-model="passwordRequireSpecialChars"
                        v-bind="passwordRequireSpecialCharsAttrs"
                        type="checkbox"
                        class="sr-only peer"
                      >
                      <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>

                  <div class="flex items-center justify-between">
                    <div>
                      <label class="text-sm font-medium text-gray-900">Enable Two-Factor Authentication</label>
                      <p class="text-sm text-gray-500">Require 2FA for all users</p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input
                        v-model="enableTwoFactor"
                        v-bind="enableTwoFactorAttrs"
                        type="checkbox"
                        class="sr-only peer"
                      >
                      <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Other tabs content would go here -->
          <div v-if="activeTab === 'notifications'" class="space-y-6">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-6">Notification Settings</h3>
              <p class="text-gray-500">Notification settings will be implemented here.</p>
            </div>
          </div>

          <div v-if="activeTab === 'appearance'" class="space-y-6">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-6">Appearance Settings</h3>
              <p class="text-gray-500">Appearance settings will be implemented here.</p>
            </div>
          </div>

          <div v-if="activeTab === 'localization'" class="space-y-6">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-6">Localization Settings</h3>
              <p class="text-gray-500">Localization settings will be implemented here.</p>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 mt-8">
            <button
              type="submit"
              :disabled="isSaving"
              class="btn btn-primary px-6 py-2"
            >
              <Save class="w-4 h-4 mr-2" />
              <span v-if="isSaving">Saving...</span>
              <span v-else>Save Settings</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
