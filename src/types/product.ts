export interface Product {
  id: string
  name: string
  sku: string  
  description: string
  serialNumber: string
  storeLocation: string
  status: 'Available' | 'Rented'
  
  currentRenterId?: string
  currentRenterName?: string
  currentDueDate?: string
  
  createdAt: string
  updatedAt: string
  createdBy?: string
}

export interface CreateProductInput {
  name: string
  sku: string  
  description: string
  serialNumber: string  
  storeLocation: string
}

export interface SerialIndex {
  serialNumber: string
  productId: string
  createdAt: string
}