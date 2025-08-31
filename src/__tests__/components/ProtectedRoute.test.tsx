/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useAuthStore } from '@/store/authStore'

vi.mock('@/store/authStore')

const renderProtectedRoute = (children: React.ReactNode = <div>Protected Content</div>) => {
  return render(
    <BrowserRouter>
      <ProtectedRoute>{children}</ProtectedRoute>
    </BrowserRouter>
  )
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should show loading state when auth is loading', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
      user: null,
      userProfile: null,
      setUser: vi.fn(),
      setUserProfile: vi.fn(),
      setLoading: vi.fn(),
      clearAuth: vi.fn(),
    })

    renderProtectedRoute()
    
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('should render children when authenticated', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: { uid: 'test-uid' } as any,
      userProfile: null,
      setUser: vi.fn(),
      setUserProfile: vi.fn(),
      setLoading: vi.fn(),
      clearAuth: vi.fn(),
    })

    renderProtectedRoute(<div>Protected Content</div>)
    
    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })

  it('should redirect to login when not authenticated', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      userProfile: null,
      setUser: vi.fn(),
      setUserProfile: vi.fn(),
      setLoading: vi.fn(),
      clearAuth: vi.fn(),
    })

    renderProtectedRoute()
    
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })
})
