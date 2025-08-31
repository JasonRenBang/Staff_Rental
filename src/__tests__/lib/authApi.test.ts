/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { signIn, register, signOutUser, getUserProfile, updateUserProfile } from '@/lib/authApi'
import type { LoginInput, RegisterInput } from '@/types/user'

vi.mock('@/lib/firebase', () => ({
  auth: {},
  db: {},
}))

vi.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  updateProfile: vi.fn(),
  onAuthStateChanged: vi.fn(),
}))

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  setDoc: vi.fn(),
  getDoc: vi.fn(),
  updateDoc: vi.fn(),
  serverTimestamp: vi.fn(() => ({ _methodName: 'serverTimestamp' })),
}))

describe('authApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const mockLoginInput: LoginInput = {
    email: 'test@example.com',
    password: 'password123',
  }

  const mockRegisterInput: RegisterInput = {
    email: 'test@example.com',
    password: 'password123',
    displayName: 'Test User',
    department: 'IT',
    phone: '1234567890',
  }

  describe('signIn', () => {
    it('should sign in user successfully', async () => {
      const { signInWithEmailAndPassword } = await import('firebase/auth')
      const mockSignIn = vi.mocked(signInWithEmailAndPassword)

      const mockUser = { uid: 'test-uid', email: 'test@example.com' }
      mockSignIn.mockResolvedValue({ user: mockUser } as any)

      const result = await signIn(mockLoginInput)

      expect(mockSignIn).toHaveBeenCalledWith({}, mockLoginInput.email, mockLoginInput.password)
      expect(result).toEqual(mockUser)
    })

    it('should throw error for invalid credentials', async () => {
      const { signInWithEmailAndPassword } = await import('firebase/auth')
      const mockSignIn = vi.mocked(signInWithEmailAndPassword)

      mockSignIn.mockRejectedValue(new Error('Invalid credentials'))

      await expect(signIn(mockLoginInput)).rejects.toThrow('Invalid credentials')
    })
  })

  describe('register', () => {
    it('should register user successfully', async () => {
      const { createUserWithEmailAndPassword, updateProfile } = await import('firebase/auth')
      const { setDoc, doc } = await import('firebase/firestore')

      const mockCreateUser = vi.mocked(createUserWithEmailAndPassword)
      const mockUpdateProfile = vi.mocked(updateProfile)
      const mockSetDoc = vi.mocked(setDoc)
      const mockDoc = vi.mocked(doc)

      const mockUser = { uid: 'test-uid', email: 'test@example.com' }
      mockCreateUser.mockResolvedValue({ user: mockUser } as any)
      mockUpdateProfile.mockResolvedValue(undefined)
      mockSetDoc.mockResolvedValue(undefined)
      mockDoc.mockReturnValue({} as any)

      const result = await register(mockRegisterInput)

      expect(mockCreateUser).toHaveBeenCalledWith(
        {},
        mockRegisterInput.email,
        mockRegisterInput.password
      )
      expect(mockUpdateProfile).toHaveBeenCalledWith(mockUser, {
        displayName: mockRegisterInput.displayName,
      })
      expect(mockSetDoc).toHaveBeenCalled()
      expect(result).toEqual(mockUser)
    })
  })

  describe('signOutUser', () => {
    it('should sign out user successfully', async () => {
      const { signOut } = await import('firebase/auth')
      const mockSignOut = vi.mocked(signOut)

      mockSignOut.mockResolvedValue(undefined)

      await signOutUser()

      expect(mockSignOut).toHaveBeenCalledWith({})
    })
  })

  describe('getUserProfile', () => {
    it('should get user profile successfully', async () => {
      const { getDoc, doc } = await import('firebase/firestore')
      const mockGetDoc = vi.mocked(getDoc)
      const mockDoc = vi.mocked(doc)

      const mockProfile = {
        uid: 'test-uid',
        email: 'test@example.com',
        displayName: 'Test User',
        role: 'staff',
      }

      mockDoc.mockReturnValue({} as any)
      mockGetDoc.mockResolvedValue({
        exists: () => true,
        data: () => mockProfile,
      } as any)

      const result = await getUserProfile('test-uid')

      expect(result).toEqual(mockProfile)
    })

    it('should return null for non-existent user', async () => {
      const { getDoc, doc } = await import('firebase/firestore')
      const mockGetDoc = vi.mocked(getDoc)
      const mockDoc = vi.mocked(doc)

      mockDoc.mockReturnValue({} as any)
      mockGetDoc.mockResolvedValue({
        exists: () => false,
      } as any)

      const result = await getUserProfile('test-uid')

      expect(result).toBeNull()
    })
  })

  describe('updateUserProfile', () => {
    it('should update user profile successfully', async () => {
      const { updateDoc, doc } = await import('firebase/firestore')
      const mockUpdateDoc = vi.mocked(updateDoc)
      const mockDoc = vi.mocked(doc)

      mockDoc.mockReturnValue({} as any)
      mockUpdateDoc.mockResolvedValue(undefined)

      const updates = { displayName: 'Updated Name', department: 'Marketing' }
      await updateUserProfile('test-uid', updates)

      expect(mockUpdateDoc).toHaveBeenCalled()
    })
  })
})
