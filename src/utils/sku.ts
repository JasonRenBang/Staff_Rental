/**
 * normalize SKU - convert to uppercase and remove spaces
 */
export function normalizeSku(sku: string): string {
    return sku.trim().toUpperCase()
  }
  
  /**
   * validate SKU format
   */
  export function validateSku(sku: string): boolean {
    const normalizedSku = normalizeSku(sku)
    // SKU format: 2-40 characters, only allowed letters, numbers, dots, underscores, and hyphens
    const skuRegex = /^[A-Z0-9._-]{2,40}$/
    return skuRegex.test(normalizedSku)
  }
  
  /**
   * generate random product ID
   */
  export function generateProductId(): string {
    return 'prod_' + Math.random().toString(36).substr(2, 9)
  }
  
  /**
   * generate random rental ID
   */
  export function generateRentalId(): string {
    return 'rent_' + Math.random().toString(36).substr(2, 9)
  }