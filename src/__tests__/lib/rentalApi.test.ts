import { describe, it, expect, vi, beforeEach } from 'vitest'
import { bookOutProduct, checkInProduct } from '@/lib/rentalApi'
import type { CreateRentalInput } from '@/types/rental'

vi.mock('@/lib/firebase', () => ({
  db: {},
}))

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  doc: vi.fn(),
  runTransaction: vi.fn(),
  getDocs: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  onSnapshot: vi.fn(),
}))

vi.mock('@/utils/sku', () => ({
  generateRentalId: () => 'test-rental-id',
}))

vi.mock('@/utils/dates', () => ({
  getCurrentDate: () => '2025-08-30',
}))

describe('Rental API', () => {
  const mockRentalInput: CreateRentalInput = {
    productId: 'test-product-id',
    staffName: 'John Doe',
    rentalDate: '2025-08-30',
    dueDate: '2025-09-05',
    storeLocation: 'CAR'
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('bookOutProduct', () => {
    it('should book out available product', async () => {
      const { runTransaction } = await import('firebase/firestore')
      const mockRunTransaction = vi.mocked(runTransaction)
      
      const mockTransaction = {
        get: vi.fn().mockResolvedValue({
          exists: () => true,
          data: () => ({ 
            status: 'Available', 
            name: 'Test Product', 
            sku: 'TEST123', 
            serialNumber: 'TEST001', 
            storeLocation: 'CAR' 
          })
        }),
        set: vi.fn(),
        update: vi.fn(),
      }
      mockRunTransaction.mockImplementation((db, callback) => 
        callback(mockTransaction).then(() => 'test-rental-id')
      )

      const result = await bookOutProduct(mockRentalInput)
      expect(result).toBe('test-rental-id')
      expect(mockTransaction.set).toHaveBeenCalledTimes(1) // rental
      expect(mockTransaction.update).toHaveBeenCalledTimes(1) // product status
    })

    it('should throw error for non-existent product', async () => {
      const { runTransaction } = await import('firebase/firestore')
      const mockRunTransaction = vi.mocked(runTransaction)
      
      const mockTransaction = {
        get: vi.fn().mockResolvedValue({
          exists: () => false
        }),
      }
      mockRunTransaction.mockImplementation((db, callback) => 
        callback(mockTransaction)
      )

      await expect(bookOutProduct(mockRentalInput)).rejects.toThrow('Product not found')
    })

    it('should throw error for unavailable product', async () => {
      const { runTransaction } = await import('firebase/firestore')
      const mockRunTransaction = vi.mocked(runTransaction)
      
      const mockTransaction = {
        get: vi.fn().mockResolvedValue({
          exists: () => true,
          data: () => ({ status: 'Rented' })
        }),
      }
      mockRunTransaction.mockImplementation((db, callback) => 
        callback(mockTransaction)
      )

      await expect(bookOutProduct(mockRentalInput)).rejects.toThrow('Product is not available for rental')
    })
  })

  describe('checkInProduct', () => {
    it('should check in rented product with open rental', async () => {
      const { runTransaction, getDocs } = await import('firebase/firestore')
      const mockRunTransaction = vi.mocked(runTransaction)
      const mockGetDocs = vi.mocked(getDocs)
      
      const mockTransaction = {
        get: vi.fn().mockResolvedValue({
          exists: () => true,
          data: () => ({ status: 'Rented' })
        }),
        update: vi.fn(),
      }
      
      mockGetDocs.mockResolvedValue({
        empty: false,
        docs: [{ id: 'rental-id', ref: {} }]
      } as any)
      
      mockRunTransaction.mockImplementation((db, callback) => 
        callback(mockTransaction)
      )

      await checkInProduct('test-product-id')
      expect(mockTransaction.update).toHaveBeenCalledTimes(2) // rental + product
    })

    it('should check in product without open rental', async () => {
      const { runTransaction, getDocs } = await import('firebase/firestore')
      const mockRunTransaction = vi.mocked(runTransaction)
      const mockGetDocs = vi.mocked(getDocs)
      
      const mockTransaction = {
        get: vi.fn().mockResolvedValue({
          exists: () => true,
          data: () => ({ status: 'Rented' })
        }),
        update: vi.fn(),
      }
      
      mockGetDocs.mockResolvedValue({
        empty: true,
        docs: []
      } as any)
      
      mockRunTransaction.mockImplementation((db, callback) => 
        callback(mockTransaction)
      )

      await checkInProduct('test-product-id')
      expect(mockTransaction.update).toHaveBeenCalledTimes(1) // only product
    })

    it('should throw error for non-existent product', async () => {
      const { runTransaction, getDocs } = await import('firebase/firestore')
      const mockRunTransaction = vi.mocked(runTransaction)
      const mockGetDocs = vi.mocked(getDocs)
      
      const mockTransaction = {
        get: vi.fn().mockResolvedValue({
          exists: () => false
        }),
      }
      
      mockGetDocs.mockResolvedValue({
        empty: true,
        docs: []
      } as any)
      
      mockRunTransaction.mockImplementation((db, callback) => 
        callback(mockTransaction)
      )

      await expect(checkInProduct('test-product-id')).rejects.toThrow('Product not found')
    })

    it('should throw error for non-rented product', async () => {
      const { runTransaction, getDocs } = await import('firebase/firestore')
      const mockRunTransaction = vi.mocked(runTransaction)
      const mockGetDocs = vi.mocked(getDocs)
      
      const mockTransaction = {
        get: vi.fn().mockResolvedValue({
          exists: () => true,
          data: () => ({ status: 'Available' })
        }),
      }
      
      mockGetDocs.mockResolvedValue({
        empty: true,
        docs: []
      } as any)
      
      mockRunTransaction.mockImplementation((db, callback) => 
        callback(mockTransaction)
      )

      await expect(checkInProduct('test-product-id')).rejects.toThrow('Product is not currently rented')
    })
  })
})
