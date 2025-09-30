import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export type Theme = 'light' | 'dark' | 'system'

export const useThemeStore = defineStore('theme', () => {
  // Get initial theme from localStorage or default to system
  const getInitialTheme = (): Theme => {
    const stored = localStorage.getItem('theme') as Theme
    if (stored && ['light', 'dark', 'system'].includes(stored)) {
      return stored
    }
    return 'system'
  }

  const theme = ref<Theme>(getInitialTheme())
  const systemPrefersDark = ref(false)

  // Check system preference
  const updateSystemPreference = () => {
    systemPrefersDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }

  // Computed property for the actual theme being used
  const activeTheme = computed(() => {
    if (theme.value === 'system') {
      return systemPrefersDark.value ? 'dark' : 'light'
    }
    return theme.value
  })

  const isDark = computed(() => activeTheme.value === 'dark')

  // Apply theme to document
  const applyTheme = () => {
    const root = document.documentElement
    
    if (isDark.value) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }

  // Set theme and persist to localStorage
  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme
    localStorage.setItem('theme', newTheme)
    applyTheme()
  }

  // Toggle between light and dark (skips system)
  const toggleTheme = () => {
    if (theme.value === 'light') {
      setTheme('dark')
    } else if (theme.value === 'dark') {
      setTheme('light')
    } else {
      // If currently system, toggle to opposite of current system preference
      setTheme(systemPrefersDark.value ? 'light' : 'dark')
    }
  }

  // Initialize theme
  const initializeTheme = () => {
    updateSystemPreference()
    applyTheme()

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', (e) => {
      systemPrefersDark.value = e.matches
      if (theme.value === 'system') {
        applyTheme()
      }
    })
  }

  // Watch for theme changes
  watch(activeTheme, applyTheme)

  return {
    theme,
    activeTheme,
    isDark,
    systemPrefersDark,
    setTheme,
    toggleTheme,
    initializeTheme
  }
})
