<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { useUsersStore } from '@/stores/users'
import { ArrowLeft, Eye, EyeOff, Save, X } from 'lucide-vue-next'

const router = useRouter()
const usersStore = useUsersStore()
const showPassword = ref(false)

const schema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  role: yup.string().oneOf(['admin', 'manager', 'user']).required('Role is required')
})

const { defineField, handleSubmit, errors, isSubmitting } = useForm({
  validationSchema: schema,
  initialValues: {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'user'
  }
})

const [firstName, firstNameAttrs] = defineField('firstName')
const [lastName, lastNameAttrs] = defineField('lastName')
const [email, emailAttrs] = defineField('email')
const [password, passwordAttrs] = defineField('password')
const [role, roleAttrs] = defineField('role')

const onSubmit = handleSubmit(async (values) => {
  const result = await usersStore.createUser(values)
  if (result.success) {
    router.push('/users')
  }
})

const goBack = () => {
  router.push('/users')
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}
</script>

<template>
  <div class="max-w-2xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center space-x-4 mb-4">
        <button
          @click="goBack"
          class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft class="w-5 h-5" />
        </button>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Create New User</h1>
          <p class="text-gray-600">Add a new user to the system</p>
        </div>
      </div>
    </div>

    <!-- Form -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <form @submit="onSubmit" class="space-y-6">
        <!-- Personal Information -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="firstName" class="block text-sm font-medium text-gray-700 mb-2">
                First Name <span class="text-red-500">*</span>
              </label>
              <input
                id="firstName"
                v-model="firstName"
                v-bind="firstNameAttrs"
                type="text"
                :class="[
                  'input w-full',
                  errors.firstName ? 'border-red-300 focus-visible:ring-red-500' : ''
                ]"
                placeholder="Enter first name"
              >
              <p v-if="errors.firstName" class="mt-1 text-sm text-red-600">
                {{ errors.firstName }}
              </p>
            </div>

            <div>
              <label for="lastName" class="block text-sm font-medium text-gray-700 mb-2">
                Last Name <span class="text-red-500">*</span>
              </label>
              <input
                id="lastName"
                v-model="lastName"
                v-bind="lastNameAttrs"
                type="text"
                :class="[
                  'input w-full',
                  errors.lastName ? 'border-red-300 focus-visible:ring-red-500' : ''
                ]"
                placeholder="Enter last name"
              >
              <p v-if="errors.lastName" class="mt-1 text-sm text-red-600">
                {{ errors.lastName }}
              </p>
            </div>
          </div>
        </div>

        <!-- Account Information -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
          <div class="space-y-6">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span class="text-red-500">*</span>
              </label>
              <input
                id="email"
                v-model="email"
                v-bind="emailAttrs"
                type="email"
                :class="[
                  'input w-full',
                  errors.email ? 'border-red-300 focus-visible:ring-red-500' : ''
                ]"
                placeholder="Enter email address"
              >
              <p v-if="errors.email" class="mt-1 text-sm text-red-600">
                {{ errors.email }}
              </p>
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                Password <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <input
                  id="password"
                  v-model="password"
                  v-bind="passwordAttrs"
                  :type="showPassword ? 'text' : 'password'"
                  :class="[
                    'input w-full pr-10',
                    errors.password ? 'border-red-300 focus-visible:ring-red-500' : ''
                  ]"
                  placeholder="Enter password"
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

            <div>
              <label for="role" class="block text-sm font-medium text-gray-700 mb-2">
                Role <span class="text-red-500">*</span>
              </label>
              <select
                id="role"
                v-model="role"
                v-bind="roleAttrs"
                :class="[
                  'input w-full',
                  errors.role ? 'border-red-300 focus-visible:ring-red-500' : ''
                ]"
              >
                <option value="">Select a role</option>
                <option value="user">User</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
              <p v-if="errors.role" class="mt-1 text-sm text-red-600">
                {{ errors.role }}
              </p>
            </div>
          </div>
        </div>

        <!-- Role Description -->
        <div v-if="role" class="bg-gray-50 rounded-lg p-4">
          <h4 class="text-sm font-semibold text-gray-900 mb-2">Role Permissions</h4>
          <div class="text-sm text-gray-600">
            <div v-if="role === 'admin'">
              <p class="font-medium text-red-700 mb-1">Administrator</p>
              <p>Full access to all features including user management, system settings, and data export.</p>
            </div>
            <div v-else-if="role === 'manager'">
              <p class="font-medium text-blue-700 mb-1">Manager</p>
              <p>Can manage users, view reports, and access most features except system settings.</p>
            </div>
            <div v-else-if="role === 'user'">
              <p class="font-medium text-gray-700 mb-1">User</p>
              <p>Basic access to dashboard and personal settings. Cannot manage other users.</p>
            </div>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            @click="goBack"
            class="btn btn-outline px-6 py-2"
          >
            <X class="w-4 h-4 mr-2" />
            Cancel
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="btn btn-primary px-6 py-2"
          >
            <Save class="w-4 h-4 mr-2" />
            <span v-if="isSubmitting">Creating...</span>
            <span v-else>Create User</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
