/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import Navigation from '@/components/Navigation'
import { useAuthStore } from '@/store/authStore'
import type { UserProfile } from '@/types/user'

// Mock dependencies
const mockUseLocation = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useLocation: () => mockUseLocation(),
  }
})

vi.mock('@/store/authStore')

vi.mock('@/lib/authApi', () => ({
  signOutUser: vi.fn(),
}))

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

const NavigationWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
)

describe('Navigation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseLocation.mockReturnValue({ pathname: '/products' })
  })

  it('should render navigation title and links without user menu when no userProfile', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      userProfile: null,
      isAuthenticated: false,
      isLoading: false,
      user: null,
      setUser: vi.fn(),
      setUserProfile: vi.fn(),
      setLoading: vi.fn(),
      clearAuth: vi.fn(),
    })

    render(
      <NavigationWrapper>
        <Navigation />
      </NavigationWrapper>
    )

    expect(screen.getByText('Staff Rental Tracker')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /products/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /book out/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /rentals/i })).toBeInTheDocument()

    // User menu should not be present
    expect(screen.queryByText('Test User')).not.toBeInTheDocument()
  })

  it('should render user menu when userProfile exists', () => {
    const mockUserProfile: UserProfile = {
      uid: 'test-uid',
      email: 'test@example.com',
      displayName: 'Test User',
      role: 'staff',
      department: 'IT',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    vi.mocked(useAuthStore).mockReturnValue({
      userProfile: mockUserProfile,
      isAuthenticated: true,
      isLoading: false,
      user: { uid: 'test-uid' } as any,
      setUser: vi.fn(),
      setUserProfile: vi.fn(),
      setLoading: vi.fn(),
      clearAuth: vi.fn(),
    })

    render(
      <NavigationWrapper>
        <Navigation />
      </NavigationWrapper>
    )

    expect(screen.getByText('Test User')).toBeInTheDocument()
    expect(screen.getByText('staff')).toBeInTheDocument()
  })

  it('should show admin badge for admin users', () => {
    const mockAdminProfile: UserProfile = {
      uid: 'admin-uid',
      email: 'admin@example.com',
      displayName: 'Admin User',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    vi.mocked(useAuthStore).mockReturnValue({
      userProfile: mockAdminProfile,
      isAuthenticated: true,
      isLoading: false,
      user: { uid: 'admin-uid' } as any,
      setUser: vi.fn(),
      setUserProfile: vi.fn(),
      setLoading: vi.fn(),
      clearAuth: vi.fn(),
    })

    render(
      <NavigationWrapper>
        <Navigation />
      </NavigationWrapper>
    )

    expect(screen.getByText('Admin User')).toBeInTheDocument()
    expect(screen.getByText('admin')).toBeInTheDocument()
  })

  it('should handle sign out when clicked', async () => {
    const { signOutUser } = await import('@/lib/authApi')
    const { toast } = await import('sonner')
    const mockSignOut = vi.mocked(signOutUser)
    const mockToast = vi.mocked(toast)
    const user = userEvent.setup()

    const mockUserProfile: UserProfile = {
      uid: 'test-uid',
      email: 'test@example.com',
      displayName: 'Test User',
      role: 'staff',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    vi.mocked(useAuthStore).mockReturnValue({
      userProfile: mockUserProfile,
      isAuthenticated: true,
      isLoading: false,
      user: { uid: 'test-uid' } as any,
      setUser: vi.fn(),
      setUserProfile: vi.fn(),
      setLoading: vi.fn(),
      clearAuth: vi.fn(),
    })

    mockSignOut.mockResolvedValue(undefined)

    render(
      <NavigationWrapper>
        <Navigation />
      </NavigationWrapper>
    )

    // Click on user menu trigger
    const userMenuTrigger = screen.getByText('Test User')
    await user.click(userMenuTrigger)

    // Wait for dropdown to appear and click sign out
    await waitFor(() => {
      const signOutButton = screen.getByText('Sign Out')
      expect(signOutButton).toBeInTheDocument()
    })

    const signOutButton = screen.getByText('Sign Out')
    await user.click(signOutButton)

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled()
      expect(mockToast.success).toHaveBeenCalledWith('Signed out successfully')
    })
  })

  it('should highlight active navigation item', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      userProfile: null,
      isAuthenticated: false,
      isLoading: false,
      user: null,
      setUser: vi.fn(),
      setUserProfile: vi.fn(),
      setLoading: vi.fn(),
      clearAuth: vi.fn(),
    })

    render(
      <NavigationWrapper>
        <Navigation />
      </NavigationWrapper>
    )

    const productsLink = screen.getByRole('link', { name: /products/i })
    const bookLink = screen.getByRole('link', { name: /book out/i })
    const rentalsLink = screen.getByRole('link', { name: /rentals/i })

    // Products should be active (has bg-primary class)
    expect(productsLink).toHaveClass('bg-primary')

    // Others should be inactive (no bg-primary class)
    expect(bookLink).not.toHaveClass('bg-primary')
    expect(rentalsLink).not.toHaveClass('bg-primary')
  })

  it('should render navigation icons', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      userProfile: null,
      isAuthenticated: false,
      isLoading: false,
      user: null,
      setUser: vi.fn(),
      setUserProfile: vi.fn(),
      setLoading: vi.fn(),
      clearAuth: vi.fn(),
    })

    render(
      <NavigationWrapper>
        <Navigation />
      </NavigationWrapper>
    )

    // Check for SVG icons (lucide-react icons render as SVGs)
    const container = screen.getByRole('navigation')
    const svgs = container.querySelectorAll('svg')
    expect(svgs.length).toBeGreaterThanOrEqual(4) // At least 1 logo + 3 nav item icons
  })

  it('should have correct link destinations', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      userProfile: null,
      isAuthenticated: false,
      isLoading: false,
      user: null,
      setUser: vi.fn(),
      setUserProfile: vi.fn(),
      setLoading: vi.fn(),
      clearAuth: vi.fn(),
    })

    render(
      <NavigationWrapper>
        <Navigation />
      </NavigationWrapper>
    )

    expect(screen.getByRole('link', { name: /products/i })).toHaveAttribute('href', '/products')
    expect(screen.getByRole('link', { name: /book out/i })).toHaveAttribute('href', '/book')
    expect(screen.getByRole('link', { name: /rentals/i })).toHaveAttribute('href', '/rentals')
  })
})
