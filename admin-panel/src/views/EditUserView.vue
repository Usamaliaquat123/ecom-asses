<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { useUsersStore } from '@/stores/users'
import { ArrowLeft, Save, X, Loader2 } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const usersStore = useUsersStore()

const userId = computed(() => route.params.id as string)
const user = computed(() => usersStore.getUserById(userId.value))
const isLoading = ref(true)

const schema = yup.object({
  firstName: yup.string().required('First name is required').min(2, 'First name must be at least 2 characters'),
  lastName: yup.string().required('Last name is required').min(2, 'Last name must be at least 2 characters'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone number is required').matches(/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number'),
  address: yup.string().required('Address is required').min(5, 'Address must be at least 5 characters'),
  role: yup.string().oneOf(['ADMIN', 'USER', 'MODERATOR']).required('Role is required'),
  isActive: yup.boolean().required()
})

const { defineField, handleSubmit, errors, isSubmitting, setValues } = useForm({
  validationSchema: schema,
  initialValues: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    role: 'USER',
    isActive: true
  }
})

const [firstName, firstNameAttrs] = defineField('firstName')
const [lastName, lastNameAttrs] = defineField('lastName')
const [email, emailAttrs] = defineField('email')
const [phone, phoneAttrs] = defineField('phone')
const [address, addressAttrs] = defineField('address')
const [role, roleAttrs] = defineField('role')
const [isActive, isActiveAttrs] = defineField('isActive')

onMounted(async () => {
  if (!user.value) {
    await usersStore.fetchUsers()
  }
  
  if (user.value) {
    setValues({
      firstName: user.value.firstName || '',
      lastName: user.value.lastName || '',
      email: user.value.email || '',
      phone: user.value.phone || '',
      address: user.value.address || '',
      role: user.value.role || 'USER',
      isActive: user.value.isActive ?? true
    })
  }
  
  isLoading.value = false
})

const onSubmit = handleSubmit(async (values) => {
  const updateData = {
    firstName: values.firstName,
    lastName: values.lastName,
    email: values.email,
    phone: values.phone,
    address: values.address,
    role: values.role as 'ADMIN' | 'USER' | 'MODERATOR',
    isActive: values.isActive
  }
  
  const result = await usersStore.updateUser(parseInt(userId.value), updateData)
  if (result.success) {
    router.push('/users')
  } else {
    console.error('Error updating user:', result.error)
  }
})

const goBack = () => {
  router.push('/users')
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
          <h1 class="text-2xl font-bold text-gray-900">Edit User</h1>
          <p class="text-gray-600">Update user information and permissions</p>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <div class="animate-pulse space-y-6">
        <div class="h-6 bg-gray-200 rounded w-1/4"></div>
        <div class="grid grid-cols-2 gap-6">
          <div class="h-10 bg-gray-200 rounded"></div>
          <div class="h-10 bg-gray-200 rounded"></div>
        </div>
        <div class="h-6 bg-gray-200 rounded w-1/4"></div>
        <div class="space-y-4">
          <div class="h-10 bg-gray-200 rounded"></div>
          <div class="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>

    <!-- User Not Found -->
    <div v-else-if="!user" class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
      <div class="text-gray-500">
        <p class="text-lg font-medium">User not found</p>
        <p class="text-sm">The user you're looking for doesn't exist.</p>
        <button @click="goBack" class="btn btn-primary mt-4">
          Go Back
        </button>
      </div>
    </div>

    <!-- Form -->
    <div v-else class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <form @submit="onSubmit" class="space-y-6">
        <!-- User Avatar and Basic Info -->
        <div class="flex items-center space-x-6 pb-6 border-b border-gray-200">
          <img 
            :src="user.avatar || `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000)}?w=150&h=150&fit=crop&crop=face`" 
            :alt="`${user.firstName} ${user.lastName}`"
            class="w-20 h-20 rounded-full object-cover"
          >
          <div>
            <h3 class="text-xl font-semibold text-gray-900">
              {{ user.firstName }} {{ user.lastName }}
            </h3>
            <p class="text-gray-600">{{ user.email }}</p>
            <p class="text-sm text-gray-500">
              Created {{ new Date(user.createdAt).toLocaleDateString() }}
            </p>
          </div>
        </div>

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
              <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
                Phone Number <span class="text-red-500">*</span>
              </label>
              <input
                id="phone"
                v-model="phone"
                v-bind="phoneAttrs"
                type="tel"
                :class="[
                  'input w-full',
                  errors.phone ? 'border-red-300 focus-visible:ring-red-500' : ''
                ]"
                placeholder="Enter phone number"
              >
              <p v-if="errors.phone" class="mt-1 text-sm text-red-600">
                {{ errors.phone }}
              </p>
            </div>

            <div>
              <label for="address" class="block text-sm font-medium text-gray-700 mb-2">
                Address <span class="text-red-500">*</span>
              </label>
              <textarea
                id="address"
                v-model="address"
                v-bind="addressAttrs"
                rows="3"
                :class="[
                  'input w-full',
                  errors.address ? 'border-red-300 focus-visible:ring-red-500' : ''
                ]"
                placeholder="Enter address"
              ></textarea>
              <p v-if="errors.address" class="mt-1 text-sm text-red-600">
                {{ errors.address }}
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
                <option value="USER">User</option>
                <option value="MODERATOR">Moderator</option>
                <option value="ADMIN">Administrator</option>
              </select>
              <p v-if="errors.role" class="mt-1 text-sm text-red-600">
                {{ errors.role }}
              </p>
            </div>

            <div>
              <label class="flex items-center">
                <input
                  v-model="isActive"
                  v-bind="isActiveAttrs"
                  type="checkbox"
                  class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                >
                <span class="ml-2 text-sm font-medium text-gray-700">
                  Active User
                </span>
              </label>
              <p class="mt-1 text-sm text-gray-500">
                Inactive users cannot log in to the system
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
            <Loader2 v-if="isSubmitting" class="w-4 h-4 mr-2 animate-spin" />
            <Save v-else class="w-4 h-4 mr-2" />
            <span v-if="isSubmitting">Updating...</span>
            <span v-else>Update User</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
