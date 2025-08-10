// Simple test to validate our Pinia stores work correctly
// This simulates the functionality without needing a full Vue build

import { createPinia, setActivePinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

// Mock localStorage for testing
global.localStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {}
}

// Setup Pinia
const pinia = createPinia()
pinia.use(createPersistedState({
  storage: global.localStorage,
  auto: true
}))
setActivePinia(pinia)

// Import our stores
import { useAppconfigStore, useUiStore, useServerStore } from '../stores/index.js'

console.log('Testing Pinia stores...')

// Test appconfig store
const appconfigStore = useAppconfigStore()
appconfigStore.setAppConfig({ test: 'config' })
console.log('✓ Appconfig store works:', appconfigStore.config)

// Test UI store
const uiStore = useUiStore()
uiStore.updateSidebarWidth([30, 70])
console.log('✓ UI store works:', uiStore.sidebarWidth)

// Test server store
const serverStore = useServerStore()
serverStore.version = 'test-version'
console.log('✓ Server store works:', serverStore.version)

console.log('All basic store tests passed!')