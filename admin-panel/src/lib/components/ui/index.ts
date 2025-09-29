// UI Components
export { default as Button } from './Button.vue'
export { default as Input } from './Input.vue'
export { default as Modal } from './Modal.vue'
export { default as Badge } from './Badge.vue'
export { default as Card } from './Card.vue'

// Types
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'ghost'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  loadingText?: string
  fullWidth?: boolean
}

export interface InputProps {
  id?: string
  label?: string
  type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'search' | 'number'
  modelValue?: string | number
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  error?: string
  hint?: string
  autocomplete?: string
  size?: 'sm' | 'md' | 'lg'
}

export interface ModalProps {
  show: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  closable?: boolean
  closeOnBackdrop?: boolean
  scrollable?: boolean
}

export interface BadgeProps {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  rounded?: boolean
}

export interface CardProps {
  title?: string
  subtitle?: string
  variant?: 'default' | 'outlined' | 'elevated'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
}
