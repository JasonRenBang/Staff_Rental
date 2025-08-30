/**
 * get current date in ISO string
 */
export function getCurrentDate(): string {
    return new Date().toISOString()
  }
  
  /**
   * format date to display string
   */
  export function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-AU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }
  
  /**
   * format date to input string (YYYY-MM-DD)
   */
  export function formatDateForInput(dateString: string): string {
    return new Date(dateString).toISOString().split('T')[0]
  }
  
  /**
   * check if overdue
   */
  export function isOverdue(dueDate: string): boolean {
    return new Date(dueDate) < new Date()
  }
  
  /**
   * check if due soon (within 24 hours)
   */
  export function isDueSoon(dueDate: string): boolean {
    const due = new Date(dueDate)
    const now = new Date()
    const hoursDiff = (due.getTime() - now.getTime()) / (1000 * 60 * 60)
    return hoursDiff > 0 && hoursDiff <= 24
  }