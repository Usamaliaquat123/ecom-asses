<script setup lang="ts">
import { ref, watch } from 'vue'
import { X, AlertTriangle } from 'lucide-vue-next'

interface Props {
  modelValue: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  confirmVariant?: 'primary' | 'danger'
}

const props = withDefaults(defineProps<Props>(), {
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  confirmVariant: 'primary'
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: []
  cancel: []
}>()

const isVisible = ref(props.modelValue)

watch(() => props.modelValue, (newValue) => {
  isVisible.value = newValue
})

const close = () => {
  isVisible.value = false
  emit('update:modelValue', false)
}

const handleConfirm = () => {
  emit('confirm')
  close()
}

const handleCancel = () => {
  emit('cancel')
  close()
}

const handleBackdropClick = (event: MouseEvent) => {
  if (event.target === event.currentTarget) {
    handleCancel()
  }
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isVisible"
      class="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <!-- Background overlay -->
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          @click="handleBackdropClick"
        ></div>

        <!-- Modal panel -->
        <div
          class="relative transform overflow-hidden rounded-2xl bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
        >
          <div class="sm:flex sm:items-start">
            <div
              :class="[
                'mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10',
                confirmVariant === 'danger' ? 'bg-red-100' : 'bg-blue-100'
              ]"
            >
              <AlertTriangle
                :class="[
                  'h-6 w-6',
                  confirmVariant === 'danger' ? 'text-red-600' : 'text-blue-600'
                ]"
              />
            </div>
            <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
              <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">
                {{ title }}
              </h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  {{ message }}
                </p>
              </div>
            </div>
          </div>
          <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              :class="[
                'inline-flex w-full justify-center rounded-lg px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto',
                confirmVariant === 'danger'
                  ? 'bg-red-600 hover:bg-red-500 focus-visible:outline-red-600'
                  : 'bg-purple-600 hover:bg-purple-500 focus-visible:outline-purple-600'
              ]"
              @click="handleConfirm"
            >
              {{ confirmText }}
            </button>
            <button
              type="button"
              class="mt-3 inline-flex w-full justify-center rounded-lg bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              @click="handleCancel"
            >
              {{ cancelText }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
