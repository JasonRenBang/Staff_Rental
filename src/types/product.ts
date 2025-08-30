export interface Product {
  id: string
  name: string
  sku: string  // 可重复，同型号产品共享
  description: string
  serialNumber: string  // 唯一，每个具体产品实例
  storeLocation: string
  status: 'Available' | 'Rented'
  
  // 当前租赁信息（冗余数据，便于查询）
  currentRenterId?: string
  currentRenterName?: string
  currentDueDate?: string
  
  // 审计字段
  createdAt: string
  updatedAt: string
  createdBy?: string
}

export interface CreateProductInput {
  name: string
  sku: string  // 不需要唯一性验证
  description: string
  serialNumber: string  // 需要唯一性验证
  storeLocation: string
}

// 序列号索引文档（用于唯一性约束）
export interface SerialIndex {
  serialNumber: string  // 唯一标识
  productId: string
  createdAt: string
}