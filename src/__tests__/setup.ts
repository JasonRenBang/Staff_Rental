import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
})

// Mock environment variables
Object.defineProperty(import.meta, 'env', {
  value: {
    VITE_FB_API_KEY: 'test-api-key',
    VITE_FB_AUTH_DOMAIN: 'test-project.firebaseapp.com',
    VITE_FB_PROJECT_ID: 'test-project',
    VITE_FB_STORAGE_BUCKET: 'test-project.appspot.com',
    VITE_FB_MESSAGING_SENDER_ID: '123456789',
    VITE_FB_APP_ID: '1:123456789:web:abcdef',
  },
})

// Mock Firebase
vi.mock('@/lib/firebase', () => ({
  db: {},
  auth: {},
}))

// Mock Firebase functions globally
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  doc: vi.fn(),
  addDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  getDocs: vi.fn(),
  getDoc: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  onSnapshot: vi.fn(),
  runTransaction: vi.fn(),
  Timestamp: {
    now: () => ({ seconds: 1693401600, nanoseconds: 0 }),
    fromDate: (date: Date) => ({ seconds: Math.floor(date.getTime() / 1000), nanoseconds: 0 }),
  },
}))
