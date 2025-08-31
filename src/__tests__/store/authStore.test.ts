/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore } from '@/store/authStore'
import type { UserProfile } from '@/types/user'

describe('authStore', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      userProfile: null,
      isLoading: true,
      isAuthenticated: false,
    })
  })

  it('should have initial state', () => {
    const state = useAuthStore.getState()

    expect(state.user).toBeNull()
    expect(state.userProfile).toBeNull()
    expect(state.isLoading).toBe(true)
    expect(state.isAuthenticated).toBe(false)
  })

  it('should set user and update authentication status', () => {
    const mockUser = { uid: 'test-uid', email: 'test@example.com' } as any

    useAuthStore.getState().setUser(mockUser)

    const state = useAuthStore.getState()
    expect(state.user).toEqual(mockUser)
    expect(state.isAuthenticated).toBe(true)
  })

  it('should clear user and update authentication status', () => {
    const mockUser = { uid: 'test-uid', email: 'test@example.com' } as any

    // Set user first
    useAuthStore.getState().setUser(mockUser)
    expect(useAuthStore.getState().isAuthenticated).toBe(true)

    // Clear user
    useAuthStore.getState().setUser(null)

    const state = useAuthStore.getState()
    expect(state.user).toBeNull()
    expect(state.isAuthenticated).toBe(false)
  })

  it('should set user profile', () => {
    const mockProfile: UserProfile = {
      uid: 'test-uid',
      email: 'test@example.com',
      displayName: 'Test User',
      role: 'staff',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    useAuthStore.getState().setUserProfile(mockProfile)

    const state = useAuthStore.getState()
    expect(state.userProfile).toEqual(mockProfile)
  })

  it('should set loading state', () => {
    useAuthStore.getState().setLoading(false)

    const state = useAuthStore.getState()
    expect(state.isLoading).toBe(false)
  })

  it('should clear all auth data', () => {
    const mockUser = { uid: 'test-uid', email: 'test@example.com' } as any
    const mockProfile: UserProfile = {
      uid: 'test-uid',
      email: 'test@example.com',
      displayName: 'Test User',
      role: 'staff',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Set data first
    useAuthStore.getState().setUser(mockUser)
    useAuthStore.getState().setUserProfile(mockProfile)

    // Clear all
    useAuthStore.getState().clearAuth()

    const state = useAuthStore.getState()
    expect(state.user).toBeNull()
    expect(state.userProfile).toBeNull()
    expect(state.isAuthenticated).toBe(false)
    expect(state.isLoading).toBe(false)
  })
})
