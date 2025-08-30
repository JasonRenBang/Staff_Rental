/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createProduct, updateProduct, deleteProduct } from '@/lib/productApi'
import type { CreateProductInput } from '@/types/product'

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
  normalizeSku: (sku: string) => sku.toUpperCase(),
  generateProductId: () => 'test-product-id',
}))

vi.mock('@/utils/dates', () => ({
  getCurrentDate: () => '2025-08-30',
}))

describe('Product API', () => {
  const mockProductInput: CreateProductInput = {
    name: 'Test Product',
    sku: 'TEST123',
    description: 'Test Description',
    serialNumber: 'TEST001',
    storeLocation: 'CAR'
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createProduct', () => {
    it('should create product successfully', async () => {
      const { runTransaction } = await import('firebase/firestore')
      const mockRunTransaction = vi.mocked(runTransaction)
      
      const mockTransaction = {
        get: vi.fn().mockResolvedValue({ exists: () => false }),
        set: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      }
      mockRunTransaction.mockImplementation((_db, callback) => 
        callback(mockTransaction).then(() => 'test-product-id')
      )

      const result = await createProduct(mockProductInput)
      expect(result).toBe('test-product-id')
      expect(mockTransaction.set).toHaveBeenCalledTimes(2) // serial index + product
    })

    it('should throw error for duplicate serial number', async () => {
      const { runTransaction } = await import('firebase/firestore')
      const mockRunTransaction = vi.mocked(runTransaction)
      
      const mockTransaction = {
        get: vi.fn().mockResolvedValue({ exists: () => true }),
        set: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      }
      mockRunTransaction.mockImplementation((_db, callback) => 
        callback(mockTransaction)
      )

      await expect(createProduct(mockProductInput)).rejects.toThrow('Serial Number already exists')
    })
  })

  describe('updateProduct', () => {
    it('should update product with same serial number', async () => {
      const { runTransaction } = await import('firebase/firestore')
      const mockRunTransaction = vi.mocked(runTransaction)
      
      const mockTransaction = {
        get: vi.fn(),
        set: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      }
      mockRunTransaction.mockImplementation((_db, callback) => 
        callback(mockTransaction)
      )

      await updateProduct('test-id', mockProductInput, 'TEST001')
      expect(mockTransaction.update).toHaveBeenCalledTimes(1) // only product update
    })

    it('should update product with new serial number', async () => {
      const { runTransaction } = await import('firebase/firestore')
      const mockRunTransaction = vi.mocked(runTransaction)
      
      const mockTransaction = {
        get: vi.fn().mockResolvedValue({ exists: () => false }),
        set: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      }
      mockRunTransaction.mockImplementation((_db, callback) => 
        callback(mockTransaction)
      )

      const updatedInput = { ...mockProductInput, serialNumber: 'TEST002' }
      await updateProduct('test-id', updatedInput, 'TEST001')
      
      expect(mockTransaction.delete).toHaveBeenCalledTimes(1) // old serial index
      expect(mockTransaction.set).toHaveBeenCalledTimes(1) // new serial index
      expect(mockTransaction.update).toHaveBeenCalledTimes(1) // product
    })

    it('should throw error for duplicate new serial number', async () => {
      const { runTransaction } = await import('firebase/firestore')
      const mockRunTransaction = vi.mocked(runTransaction)
      
      const mockTransaction = {
        get: vi.fn().mockResolvedValue({ exists: () => true }),
        set: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      }
      mockRunTransaction.mockImplementation((_db, callback) => 
        callback(mockTransaction)
      )

      const updatedInput = { ...mockProductInput, serialNumber: 'DUPLICATE' }
      await expect(updateProduct('test-id', updatedInput, 'TEST001')).rejects.toThrow('Serial Number already exists')
    })
  })

  describe('deleteProduct', () => {
    it('should delete product and serial index', async () => {
      const { runTransaction } = await import('firebase/firestore')
      const mockRunTransaction = vi.mocked(runTransaction)
      
      const mockTransaction = {
        get: vi.fn(),
        set: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      }
      mockRunTransaction.mockImplementation((_db, callback) => 
        callback(mockTransaction)
      )

      await deleteProduct('test-id', 'TEST001')
      expect(mockTransaction.delete).toHaveBeenCalledTimes(2) // serial index + product
    })
  })
})