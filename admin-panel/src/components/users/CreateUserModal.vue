<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { X, User, Mail, Phone, MapPin, Shield, Eye, EyeOff, UserPlus, Loader2 } from 'lucide-vue-next'
import { useUsersStore } from '@/stores/users'
import { Modal, Button, Input, FormField, Select } from '@/lib/components'
import type { CreateUserData } from '@/services/api'

interface Props {
  show: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'created', user: CreateUserData): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const usersStore = useUsersStore()
const isLoading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

// Form validation schema
const schema = yup.object({
  firstName: yup.string().required('First name is required').min(2, 'First name must be at least 2 characters'),
  lastName: yup.string().required('Last name is required').min(2, 'Last name must be at least 2 characters'),
  email: yup.string().required('Email is required').email('Please enter a valid email'),
  phone: yup.string().required('Phone number is required').matches(/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number'),
  address: yup.string().required('Address is required').min(5, 'Address must be at least 5 characters'),
  role: yup.string().required('Role is required').oneOf(['ADMIN', 'USER', 'MODERATOR'], 'Please select a valid role'),
  password: yup.string().required('Password is required').min(8, 'Password must be at least 8 characters'),
  confirmPassword: yup.string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match')
})

const { handleSubmit, resetForm } = useForm({
  validationSchema: schema,
  initialValues: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    role: 'user',
    password: '',
    confirmPassword: ''
  }
})

// Individual field validation with better error control
const { value: firstName, errorMessage: firstNameError, meta: firstNameMeta } = useField('firstName')
const { value: lastName, errorMessage: lastNameError, meta: lastNameMeta } = useField('lastName')
const { value: email, errorMessage: emailError, meta: emailMeta } = useField('email')
const { value: phone, errorMessage: phoneError, meta: phoneMeta } = useField('phone')
const { value: address, errorMessage: addressError, meta: addressMeta } = useField('address')
const { value: role, errorMessage: roleError } = useField('role')
const { value: password, errorMessage: passwordError, meta: passwordMeta } = useField('password')
const { value: confirmPassword, errorMessage: confirmPasswordError, meta: confirmPasswordMeta } = useField('confirmPassword')

// Show errors only after field has been touched and is invalid
const showFirstNameError = computed(() => firstNameMeta.touched && firstNameError.value)
const showLastNameError = computed(() => lastNameMeta.touched && lastNameError.value)
const showEmailError = computed(() => emailMeta.touched && emailError.value)
const showPhoneError = computed(() => phoneMeta.touched && phoneError.value)
const showAddressError = computed(() => addressMeta.touched && addressError.value)
const showPasswordError = computed(() => passwordMeta.touched && passwordError.value)
const showConfirmPasswordError = computed(() => confirmPasswordMeta.touched && confirmPasswordError.value)

const roles = [
  { value: 'ADMIN', label: 'Administrator', description: 'Full system access', color: 'bg-red-100 text-red-800' },
  { value: 'MODERATOR', label: 'Moderator', description: 'Content management', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'USER', label: 'User', description: 'Standard access', color: 'bg-green-100 text-green-800' }
]

const selectedRole = computed(() => roles.find(r => r.value === role.value))

const onSubmit = handleSubmit(async (formValues) => {
  isLoading.value = true
  
  try {
    const userData: CreateUserData = {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      phone: phone.value,
      address: address.value,
      role: role.value as 'ADMIN' | 'USER' | 'MODERATOR',
      password: password.value
    }
    
    // Call the API through the users store
    const result = await usersStore.createUser(userData)
    
    if (result.success) {
      emit('created', result.user!)
      resetForm()
      emit('close')
    } else {
      console.error('Error creating user:', result.error)
      // You could add error handling UI here
    }
  } catch (error) {
    console.error('Error creating user:', error)
  } finally {
    isLoading.value = false
  }
})

const closeModal = () => {
  if (!isLoading.value) {
    emit('close')
    resetForm()
  }
}

// Close modal on escape key
watch(() => props.show, (show) => {
  if (show) {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }
})
</script>

<template>
  <!-- Modal Overlay -->
  <Transition
    enter-active-class="transition-opacity duration-300 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="show"
      class="fixed inset-0 z-50 overflow-y-auto"
      @click.self="closeModal"
    >
      <div class="flex min-h-full items-center justify-center p-4">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm"></div>
        
        <!-- Modal Content -->
        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 scale-95 translate-y-4"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-4"
        >
          <div
            v-if="show"
            class="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            <!-- Header -->
            <div class="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                    <UserPlus class="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 class="text-xl font-semibold text-white">Create New User</h3>
                    <p class="text-purple-100 text-sm">Add a new user to your system</p>
                  </div>
                </div>
                <button
                  @click="closeModal"
                  :disabled="isLoading"
                  class="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors disabled:opacity-50"
                >
                  <X class="w-5 h-5" />
                </button>
              </div>
            </div>

            <!-- Form Content -->
            <form @submit="onSubmit" class="p-6 space-y-6 max-h-[70vh] overflow-y-auto scrollbar-hide">
              <!-- Personal Information -->
              <div class="space-y-4">
                <h4 class="text-lg font-semibold text-gray-900 flex items-center">
                  <User class="w-5 h-5 mr-2 text-purple-600" />
                  Personal Information
                </h4>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- First Name -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      v-model="firstName"
                      type="text"
                      placeholder="Enter first name"
                      class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      :class="{ 'border-red-300 bg-red-50': showFirstNameError }"
                    />
                    <p v-if="showFirstNameError" class="mt-1 text-sm text-red-600">{{ firstNameError }}</p>
                  </div>

                  <!-- Last Name -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      v-model="lastName"
                      type="text"
                      placeholder="Enter last name"
                      class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      :class="{ 'border-red-300 bg-red-50': showLastNameError }"
                    />
                    <p v-if="showLastNameError" class="mt-1 text-sm text-red-600">{{ lastNameError }}</p>
                  </div>
                </div>
              </div>

              <!-- Contact Information -->
              <div class="space-y-4">
                <h4 class="text-lg font-semibold text-gray-900 flex items-center">
                  <Mail class="w-5 h-5 mr-2 text-purple-600" />
                  Contact Information
                </h4>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Email -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      v-model="email"
                      type="email"
                      placeholder="Enter email address"
                      class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      :class="{ 'border-red-300 bg-red-50': showEmailError }"
                    />
                    <p v-if="showEmailError" class="mt-1 text-sm text-red-600">{{ emailError }}</p>
                  </div>

                  <!-- Phone -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      v-model="phone"
                      type="tel"
                      placeholder="Enter phone number"
                      class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      :class="{ 'border-red-300 bg-red-50': showPhoneError }"
                    />
                    <p v-if="showPhoneError" class="mt-1 text-sm text-red-600">{{ phoneError }}</p>
                  </div>
                </div>

                <!-- Address -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin class="w-4 h-4 inline mr-1" />
                    Address *
                  </label>
                  <textarea
                    v-model="address"
                    placeholder="Enter full address"
                    rows="3"
                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                    :class="{ 'border-red-300 bg-red-50': showAddressError }"
                  ></textarea>
                  <p v-if="showAddressError" class="mt-1 text-sm text-red-600">{{ addressError }}</p>
                </div>
              </div>

              <!-- Role Selection -->
              <div class="space-y-4">
                <h4 class="text-lg font-semibold text-gray-900 flex items-center">
                  <Shield class="w-5 h-5 mr-2 text-purple-600" />
                  Role & Permissions
                </h4>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div
                    v-for="roleOption in roles"
                    :key="roleOption.value"
                    @click="role = roleOption.value"
                    class="relative p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md"
                    :class="role === roleOption.value 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-gray-200 hover:border-gray-300'"
                  >
                    <div class="flex items-center space-x-3">
                      <input
                        type="radio"
                        :value="roleOption.value"
                        :checked="role === roleOption.value"
                        class="w-4 h-4 text-purple-600"
                        readonly
                      />
                      <div class="flex-1">
                        <div class="flex items-center justify-between">
                          <h5 class="font-medium text-gray-900">{{ roleOption.label }}</h5>
                          <span :class="roleOption.color" class="px-2 py-1 text-xs font-medium rounded-full">
                            {{ roleOption.value.toUpperCase() }}
                          </span>
                        </div>
                        <p class="text-sm text-gray-500 mt-1">{{ roleOption.description }}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <p v-if="roleError" class="text-sm text-red-600">{{ roleError }}</p>
              </div>

              <!-- Security -->
              <div class="space-y-4">
                <h4 class="text-lg font-semibold text-gray-900 flex items-center">
                  <Shield class="w-5 h-5 mr-2 text-purple-600" />
                  Security
                </h4>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Password -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Password *
                    </label>
                    <div class="relative">
                      <input
                        v-model="password"
                        :type="showPassword ? 'text' : 'password'"
                        placeholder="Enter password"
                        class="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        :class="{ 'border-red-300 bg-red-50': showPasswordError }"
                      />
                      <button
                        type="button"
                        @click="showPassword = !showPassword"
                        class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <Eye v-if="!showPassword" class="w-5 h-5" />
                        <EyeOff v-else class="w-5 h-5" />
                      </button>
                    </div>
                    <p v-if="showPasswordError" class="mt-1 text-sm text-red-600">{{ passwordError }}</p>
                  </div>

                  <!-- Confirm Password -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password *
                    </label>
                    <div class="relative">
                      <input
                        v-model="confirmPassword"
                        :type="showConfirmPassword ? 'text' : 'password'"
                        placeholder="Confirm password"
                        class="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        :class="{ 'border-red-300 bg-red-50': showConfirmPasswordError }"
                      />
                      <button
                        type="button"
                        @click="showConfirmPassword = !showConfirmPassword"
                        class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <Eye v-if="!showConfirmPassword" class="w-5 h-5" />
                        <EyeOff v-else class="w-5 h-5" />
                      </button>
                    </div>
                    <p v-if="showConfirmPasswordError" class="mt-1 text-sm text-red-600">{{ confirmPasswordError }}</p>
                  </div>
                </div>
              </div>

              <!-- Preview Card -->
              <div v-if="firstName || lastName" class="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-200">
                <h5 class="text-sm font-medium text-gray-700 mb-2">Preview</h5>
                <div class="flex items-center space-x-3">
                  <div class="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                    <span class="text-white font-semibold text-lg">
                      {{ (firstName?.[0] || '') + (lastName?.[0] || '') }}
                    </span>
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">{{ firstName }} {{ lastName }}</p>
                    <p class="text-sm text-gray-500">{{ email }}</p>
                    <span v-if="selectedRole" :class="selectedRole.color" class="inline-block px-2 py-1 text-xs font-medium rounded-full mt-1">
                      {{ selectedRole.label }}
                    </span>
                  </div>
                </div>
              </div>
            </form>

            <!-- Footer -->
            <div class="bg-gray-50 px-6 py-4 flex items-center justify-between">
              <p class="text-sm text-gray-500">
                * Required fields
              </p>
              <div class="flex items-center space-x-3">
                <button
                  type="button"
                  @click="closeModal"
                  :disabled="isLoading"
                  class="px-6 py-2.5 text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  @click="onSubmit"
                  :disabled="isLoading"
                  class="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 flex items-center space-x-2"
                >
                  <Loader2 v-if="isLoading" class="w-4 h-4 animate-spin" />
                  <UserPlus v-else class="w-4 h-4" />
                  <span>{{ isLoading ? 'Creating...' : 'Create User' }}</span>
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
