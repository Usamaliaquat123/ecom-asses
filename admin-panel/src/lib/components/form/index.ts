// Form Components
export { default as FormField } from './FormField.vue'
export { default as Select } from './Select.vue'

// Types
export interface FormFieldProps {
  id?: string
  label?: string
  error?: string
  hint?: string
  required?: boolean
  disabled?: boolean
}

export interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
}

export interface SelectProps {
  id?: string
  label?: string
  modelValue?: string | number
  options: SelectOption[] | string[]
  placeholder?: string
  disabled?: boolean
  required?: boolean
  error?: string
  hint?: string
  size?: 'sm' | 'md' | 'lg'
}
