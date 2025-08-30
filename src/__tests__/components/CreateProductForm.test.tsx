import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CreateProductForm from '@/components/CreateProductForm'
import { createProduct, updateProduct } from '@/lib/productApi'

// Mock Firebase
vi.mock('@/lib/productApi', () => ({
  createProduct: vi.fn(),
  updateProduct: vi.fn(),
}))

// Mock UI Store
vi.mock('@/store/uiStore', () => ({
  useUiStore: () => ({
    defaultStoreLocation: 'CAR',
    setCreateProductOpen: vi.fn(),
  }),
}))

// Mock toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

describe('CreateProductForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render all form fields', () => {
    render(<CreateProductForm />)
    
    expect(screen.getByLabelText(/product name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/sku/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/serial number/i)).toBeInTheDocument()
    expect(screen.getByText(/store location/i)).toBeInTheDocument() // Select doesn't use htmlFor
    expect(screen.getByRole('button', { name: /create product/i })).toBeInTheDocument()
  })

  it('should validate required fields', async () => {
    const user = userEvent.setup()
    render(<CreateProductForm />)
    
    const submitButton = screen.getByRole('button', { name: /create product/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/product name is required/i)).toBeInTheDocument()
      expect(screen.getByText(/sku must be at least/i)).toBeInTheDocument()
      expect(screen.getByText(/description is required/i)).toBeInTheDocument()
      expect(screen.getByText(/serial number is required/i)).toBeInTheDocument()
    })
  })

  it('should validate SKU format', async () => {
    const user = userEvent.setup()
    render(<CreateProductForm />)
    
    const nameInput = screen.getByLabelText(/product name/i)
    const skuInput = screen.getByLabelText(/sku/i)
    const descInput = screen.getByLabelText(/description/i)
    const serialInput = screen.getByLabelText(/serial number/i)
    
    await user.type(nameInput, 'Test Product')
    await user.type(skuInput, 'INVALID@SKU')
    await user.type(descInput, 'Test Description')
    await user.type(serialInput, 'TEST001')
    
    const submitButton = screen.getByRole('button', { name: /create product/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/sku format invalid/i)).toBeInTheDocument()
    })
  })

  it('should submit valid form data', async () => {
    const user = userEvent.setup()
    const mockCreateProduct = vi.mocked(createProduct)
    mockCreateProduct.mockResolvedValue('new-product-id')
    
    render(<CreateProductForm />)
    
    await user.type(screen.getByLabelText(/product name/i), 'Test Product')
    await user.type(screen.getByLabelText(/sku/i), 'TEST123')
    await user.type(screen.getByLabelText(/description/i), 'Test Description')
    await user.type(screen.getByLabelText(/serial number/i), 'TEST001')
    
    const submitButton = screen.getByRole('button', { name: /create product/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(mockCreateProduct).toHaveBeenCalledWith({
        name: 'Test Product',
        sku: 'TEST123',
        description: 'Test Description',
        serialNumber: 'TEST001',
        storeLocation: 'CAR'
      })
    })
  })

  it('should show edit mode when editing product', () => {
    const editingProduct = {
      id: 'test-id',
      name: 'Existing Product',
      sku: 'EXIST123',
      description: 'Existing Description',
      serialNumber: 'EXIST001',
      storeLocation: 'SYD',
      status: 'Available' as const,
      createdAt: '2025-08-30',
      updatedAt: '2025-08-30'
    }
    
    render(<CreateProductForm editingProduct={editingProduct} />)
    
    expect(screen.getByRole('button', { name: /update product/i })).toBeInTheDocument()
    expect(screen.getByDisplayValue('Existing Product')).toBeInTheDocument()
    expect(screen.getByDisplayValue('EXIST123')).toBeInTheDocument()
  })

  it('should handle form submission errors', async () => {
    const user = userEvent.setup()
    const mockCreateProduct = vi.mocked(createProduct)
    mockCreateProduct.mockRejectedValue(new Error('Serial Number already exists'))
    
    render(<CreateProductForm />)
    
    await user.type(screen.getByLabelText(/product name/i), 'Test Product')
    await user.type(screen.getByLabelText(/sku/i), 'TEST123')
    await user.type(screen.getByLabelText(/description/i), 'Test Description')
    await user.type(screen.getByLabelText(/serial number/i), 'DUPLICATE001')
    
    const submitButton = screen.getByRole('button', { name: /create product/i })
    await user.click(submitButton)
    
    // Just verify the function was called and form didn't reset
    await waitFor(() => {
      expect(mockCreateProduct).toHaveBeenCalled()
    })
    
    // Verify form still has values (indicating error was handled)
    expect(screen.getByDisplayValue('Test Product')).toBeInTheDocument()
  })

  it('should update existing product', async () => {
    const user = userEvent.setup()
    const mockUpdateProduct = vi.mocked(updateProduct)
    mockUpdateProduct.mockResolvedValue()
    
    const editingProduct = {
      id: 'test-id',
      name: 'Existing Product',
      sku: 'EXIST123',
      description: 'Existing Description',
      serialNumber: 'EXIST001',
      storeLocation: 'SYD',
      status: 'Available' as const,
      createdAt: '2025-08-30',
      updatedAt: '2025-08-30'
    }
    
    render(<CreateProductForm editingProduct={editingProduct} />)
    
    const nameInput = screen.getByLabelText(/product name/i)
    await user.clear(nameInput)
    await user.type(nameInput, 'Updated Product')
    
    const submitButton = screen.getByRole('button', { name: /update product/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(mockUpdateProduct).toHaveBeenCalledWith(
        'test-id',
        {
          name: 'Updated Product',
          sku: 'EXIST123',
          description: 'Existing Description',
          serialNumber: 'EXIST001',
          storeLocation: 'SYD'
        },
        'EXIST001'
      )
    })
  })
})