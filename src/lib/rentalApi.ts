import {
  collection,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  runTransaction,
  getDocs,
} from 'firebase/firestore'
import { db } from './firebase'
import type { Rental, CreateRentalInput } from '@/types/rental'
import type { Product } from '@/types/product'
import { generateRentalId } from '@/utils/sku'
import { getCurrentDate } from '@/utils/dates'

/**
 * Book out a product (create rental + update product status)
 */
export async function bookOutProduct(input: CreateRentalInput): Promise<string> {
  const rentalId = generateRentalId()

  return await runTransaction(db, async transaction => {
    const productRef = doc(db, 'products', input.productId)
    const productDoc = await transaction.get(productRef)

    if (!productDoc.exists()) {
      throw new Error('Product not found')
    }

    const product = productDoc.data() as Product
    if (product.status !== 'Available') {
      throw new Error('Product is not available for rental')
    }
    const rental: Omit<Rental, 'id'> = {
      productId: input.productId,
      productSnapshot: {
        name: product.name,
        sku: product.sku,
        serialNumber: product.serialNumber,
        storeLocation: product.storeLocation,
      },
      staffName: input.staffName,
      rentalDate: input.rentalDate,
      dueDate: input.dueDate,
      status: 'Open',
      createdAt: getCurrentDate(),
      updatedAt: getCurrentDate(),
    }

    const rentalRef = doc(db, 'rentals', rentalId)
    transaction.set(rentalRef, rental)

    transaction.update(productRef, {
      status: 'Rented',
      currentRenterName: input.staffName,
      currentDueDate: input.dueDate,
      updatedAt: getCurrentDate(),
    })

    return rentalId
  })
}

/**
 * Check in a product (close rental + update product status)
 */
export async function checkInProduct(productId: string): Promise<void> {
  // 1. First find the open rental
  const rentalsRef = collection(db, 'rentals')
  const openRentalQuery = query(
    rentalsRef,
    where('productId', '==', productId),
    where('status', '==', 'Open')
  )
  const openRentalSnapshot = await getDocs(openRentalQuery)

  // 2. Then run transaction to update both rental and product
  return await runTransaction(db, async transaction => {
    // Get product
    const productRef = doc(db, 'products', productId)
    const productDoc = await transaction.get(productRef)

    if (!productDoc.exists()) {
      throw new Error('Product not found')
    }

    const product = productDoc.data() as Product
    if (product.status !== 'Rented') {
      throw new Error('Product is not currently rented')
    }

    // Close the open rental if found
    if (!openRentalSnapshot.empty) {
      const rentalDoc = openRentalSnapshot.docs[0]
      const rentalRef = doc(db, 'rentals', rentalDoc.id)
      transaction.update(rentalRef, {
        status: 'Closed',
        returnDate: getCurrentDate(),
        updatedAt: getCurrentDate(),
      })
    }

    // Update product status
    transaction.update(productRef, {
      status: 'Available',
      currentRenterName: null,
      currentDueDate: null,
      updatedAt: getCurrentDate(),
    })
  })
}

/**
 * Get open rentals (real-time subscription)
 */
export function subscribeToOpenRentals(callback: (rentals: Rental[]) => void) {
  const q = query(
    collection(db, 'rentals'),
    where('status', '==', 'Open'),
    orderBy('dueDate', 'asc')
  )

  return onSnapshot(q, snapshot => {
    const rentals: Rental[] = snapshot.docs.map(
      doc =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Rental)
    )
    callback(rentals)
  })
}

/**
 * Get closed rentals (real-time subscription)
 */
export function subscribeToClosedRentals(callback: (rentals: Rental[]) => void) {
  const q = query(
    collection(db, 'rentals'),
    where('status', '==', 'Closed'),
    orderBy('returnDate', 'desc')
  )

  return onSnapshot(q, snapshot => {
    const rentals: Rental[] = snapshot.docs.map(
      doc =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Rental)
    )
    callback(rentals)
  })
}
