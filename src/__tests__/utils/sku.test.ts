import { describe, it, expect } from 'vitest'
import { validateSku, normalizeSku, generateProductId } from '@/utils/sku'

describe('SKU Utils', () => {
  describe('validateSku', () => {
    it('should accept valid SKUs', () => {
      expect(validateSku('ABC123')).toBe(true)
      expect(validateSku('MS123')).toBe(true)
      expect(validateSku('IP15PRO')).toBe(true)
    })

    it('should reject invalid SKUs', () => {
      expect(validateSku('ABC@123')).toBe(false)
      expect(validateSku('AB C123')).toBe(false)
      expect(validateSku('')).toBe(false)
    })
  })

  describe('normalizeSku', () => {
    it('should normalize SKU to uppercase', () => {
      expect(normalizeSku('abc123')).toBe('ABC123')
      expect(normalizeSku('Ms123')).toBe('MS123')
    })
  })

  describe('generateProductId', () => {
    it('should generate unique product IDs', () => {
      const id1 = generateProductId()
      const id2 = generateProductId()
      expect(id1).not.toBe(id2)
      expect(id1).toMatch(/^prod_[a-z0-9]+$/)
    })
  })
})
