import { 
    collection, 
    doc, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    getDocs, 
    getDoc,
    query, 
    where, 
    orderBy, 
    onSnapshot,
    runTransaction,
    Timestamp 
  } from 'firebase/firestore'
  import { db } from './firebase'
  import type { Product, CreateProductInput, SerialIndex } from '@/types/product'
  import { normalizeSku, generateProductId } from '@/utils/sku'
  import { getCurrentDate } from '@/utils/dates'
  
  /**
   * Create product (with Serial Number uniqueness check)
   */
  export async function createProduct(input: CreateProductInput): Promise<string> {
    const normalizedSku = normalizeSku(input.sku)
    const normalizedSerial = input.serialNumber.trim().toUpperCase()
    const productId = generateProductId()
    
    return await runTransaction(db, async (transaction) => {
      // 1. Check if Serial Number already exists
      const serialIndexRef = doc(db, 'serial_index', normalizedSerial)
      const serialDoc = await transaction.get(serialIndexRef)
      
      if (serialDoc.exists()) {
        throw new Error('Serial Number already exists')
      }
      
      // 2. Create Serial Number index
      const serialIndex: SerialIndex = {
        serialNumber: normalizedSerial,
        productId,
        createdAt: getCurrentDate()
      }
      transaction.set(serialIndexRef, serialIndex)
      
      // 3. Create product
      const product: Omit<Product, 'id'> = {
        ...input,
        sku: normalizedSku,
        serialNumber: normalizedSerial,
        status: 'Available',
        createdAt: getCurrentDate(),
        updatedAt: getCurrentDate()
      }
      
      const productRef = doc(db, 'products', productId)
      transaction.set(productRef, product)
      
      return productId
    })
  }
  
  /**
   * Get all products (real-time subscription)
   */
  export function subscribeToProducts(callback: (products: Product[]) => void) {
    const q = query(
      collection(db, 'products'),
      orderBy('createdAt', 'desc')
    )
    
    return onSnapshot(q, (snapshot) => {
      const products: Product[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Product))
      callback(products)
    })
  }
  
  /**
   * Update product status to rented
   */
  export async function markProductAsRented(
    productId: string, 
    renterName: string, 
    dueDate: string
  ): Promise<void> {
    const productRef = doc(db, 'products', productId)
    await updateDoc(productRef, {
      status: 'Rented',
      currentRenterName: renterName,
      currentDueDate: dueDate,
      updatedAt: getCurrentDate()
    })
  }
  
  /**
   * Update product status to available
   */
  export async function markProductAsAvailable(productId: string): Promise<void> {
    const productRef = doc(db, 'products', productId)
    await updateDoc(productRef, {
      status: 'Available',
      currentRenterName: null,
      currentDueDate: null,
      updatedAt: getCurrentDate()
    })
  }
  
  /**
 * Update product
 */
export async function updateProduct(productId: string, input: CreateProductInput, oldSerialNumber: string): Promise<void> {
  const normalizedSku = normalizeSku(input.sku)
  const normalizedSerial = input.serialNumber.trim().toUpperCase()
  const normalizedOldSerial = oldSerialNumber.trim().toUpperCase()
  
  return await runTransaction(db, async (transaction) => {
    // If serial number changed, check uniqueness and update index
    if (normalizedSerial !== normalizedOldSerial) {
      // 1. Check if new Serial Number already exists
      const newSerialIndexRef = doc(db, 'serial_index', normalizedSerial)
      const newSerialDoc = await transaction.get(newSerialIndexRef)
      
      if (newSerialDoc.exists()) {
        throw new Error('Serial Number already exists')
      }
      
      // 2. Delete old Serial Number index
      const oldSerialIndexRef = doc(db, 'serial_index', normalizedOldSerial)
      transaction.delete(oldSerialIndexRef)
      
      // 3. Create new Serial Number index
      const serialIndex: SerialIndex = {
        serialNumber: normalizedSerial,
        productId,
        createdAt: getCurrentDate()
      }
      transaction.set(newSerialIndexRef, serialIndex)
    }
    
    // 4. Update product
    const productRef = doc(db, 'products', productId)
    transaction.update(productRef, {
      ...input,
      sku: normalizedSku,
      serialNumber: normalizedSerial,
      updatedAt: getCurrentDate()
    })
  })
}

/**
 * Delete product (also delete Serial Number index)
 */
export async function deleteProduct(productId: string, serialNumber: string): Promise<void> {
  const normalizedSerial = serialNumber.trim().toUpperCase()
  
  return await runTransaction(db, async (transaction) => {
    // 1. Delete Serial Number index
    const serialIndexRef = doc(db, 'serial_index', normalizedSerial)
    transaction.delete(serialIndexRef)
    
    // 2. Delete product
    const productRef = doc(db, 'products', productId)
    transaction.delete(productRef)
  })
}