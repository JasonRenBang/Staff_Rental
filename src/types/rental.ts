export interface Rental {
  id: string
  productId: string
  
  // product snapshot 
  productSnapshot: {
    name: string
    sku: string
    serialNumber: string
    storeLocation: string
  }
  
  // rental information
  staffName: string
  rentalDate: string
  dueDate: string
  returnDate?: string
  
  // status
  status: 'Open' | 'Closed'
  
  // audit fields
  createdAt: string
  updatedAt: string
  createdBy?: string
}

export interface CreateRentalInput {
  productId: string
  staffName: string
  rentalDate: string
  dueDate: string
  storeLocation: string
}