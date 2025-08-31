import { create } from 'zustand'
import type { User as FirebaseUser } from 'firebase/auth'
import type { UserProfile } from '@/types/user'

interface AuthState {
  user: FirebaseUser | null
  userProfile: UserProfile | null
  isLoading: boolean
  isAuthenticated: boolean
  setUser: (user: FirebaseUser | null) => void
  setUserProfile: (profile: UserProfile | null) => void
  setLoading: (loading: boolean) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  userProfile: null,
  isLoading: true,
  isAuthenticated: false,
  
  setUser: (user) => set({ 
    user, 
    isAuthenticated: !!user 
  }),
  
  setUserProfile: (userProfile) => set({ userProfile }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  clearAuth: () => set({ 
    user: null, 
    userProfile: null, 
    isAuthenticated: false,
    isLoading: false 
  }),
}))
