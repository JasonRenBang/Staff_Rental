import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Navigation from '@/components/Navigation'

// Mock react-router-dom
const mockUseLocation = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useLocation: () => mockUseLocation(),
  }
})

const NavigationWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
)

describe('Navigation', () => {
  it('should render navigation title and links', () => {
    mockUseLocation.mockReturnValue({ pathname: '/products' })
    
    render(
      <NavigationWrapper>
        <Navigation />
      </NavigationWrapper>
    )
    
    expect(screen.getByText('Staff Rental Tracker')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /products/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /book out/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /rentals/i })).toBeInTheDocument()
  })

  it('should highlight active navigation item', () => {
    mockUseLocation.mockReturnValue({ pathname: '/products' })
    
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

  it('should highlight book out page when active', () => {
    mockUseLocation.mockReturnValue({ pathname: '/book' })
    
    render(
      <NavigationWrapper>
        <Navigation />
      </NavigationWrapper>
    )
    
    const productsLink = screen.getByRole('link', { name: /products/i })
    const bookLink = screen.getByRole('link', { name: /book out/i })
    const rentalsLink = screen.getByRole('link', { name: /rentals/i })
    
    // Book Out should be active
    expect(bookLink).toHaveClass('bg-primary')
    
    // Others should be inactive
    expect(productsLink).not.toHaveClass('bg-primary')
    expect(rentalsLink).not.toHaveClass('bg-primary')
  })

  it('should highlight rentals page when active', () => {
    mockUseLocation.mockReturnValue({ pathname: '/rentals' })
    
    render(
      <NavigationWrapper>
        <Navigation />
      </NavigationWrapper>
    )
    
    const productsLink = screen.getByRole('link', { name: /products/i })
    const bookLink = screen.getByRole('link', { name: /book out/i })
    const rentalsLink = screen.getByRole('link', { name: /rentals/i })
    
    // Rentals should be active
    expect(rentalsLink).toHaveClass('bg-primary')
    
    // Others should be inactive
    expect(productsLink).not.toHaveClass('bg-primary')
    expect(bookLink).not.toHaveClass('bg-primary')
  })

  it('should render navigation icons', () => {
    mockUseLocation.mockReturnValue({ pathname: '/products' })
    
    render(
      <NavigationWrapper>
        <Navigation />
      </NavigationWrapper>
    )
    
    // Check for SVG icons (lucide-react icons render as SVGs with aria-hidden)
    const container = screen.getByRole('navigation')
    const svgs = container.querySelectorAll('svg')
    expect(svgs).toHaveLength(4) // 1 logo + 3 nav item icons
  })

  it('should have correct link destinations', () => {
    mockUseLocation.mockReturnValue({ pathname: '/products' })
    
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
