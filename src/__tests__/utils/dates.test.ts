import { describe, it, expect } from 'vitest'
import { formatDate, isOverdue, isDueSoon } from '@/utils/dates'

describe('Date Utils', () => {
  describe('formatDate', () => {
    it('should format date correctly', () => {
      expect(formatDate('2025-08-30')).toBe('30/08/2025')
      expect(formatDate('2025-08-31')).toBe('31/08/2025')
    })
  })

  describe('isOverdue', () => {
    it('should detect overdue dates', () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toISOString().split('T')[0]

      expect(isOverdue(yesterdayStr)).toBe(true)
    })

    it('should not mark future dates as overdue', () => {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      const tomorrowStr = tomorrow.toISOString().split('T')[0]

      expect(isOverdue(tomorrowStr)).toBe(false)
    })
  })

  describe('isDueSoon', () => {
    it('should detect due soon dates', () => {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      const tomorrowStr = tomorrow.toISOString().split('T')[0]

      expect(isDueSoon(tomorrowStr)).toBe(true)
    })
  })
})
