import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Product } from '@/types/product'
import { subscribeToProducts } from '@/lib/productApi'
import { bookOutProduct } from '@/lib/rentalApi'
import { useUiStore } from '@/store/uiStore'
import { formatDateForInput, getCurrentDate } from '@/utils/dates'
import ProductSelector from '@/components/booking/ProductSelector'
import BookingFormFields from '@/components/booking/BookingFormFields'

const bookOutSchema = z
  .object({
    productId: z.string().min(1, 'Please select a product'),
    staffName: z.string().min(1, 'Staff name is required').max(100, 'Name too long'),
    rentalDate: z.string().min(1, 'Rental date is required'),
    dueDate: z.string().min(1, 'Due date is required'),
    storeLocation: z.string().min(1, 'Store location is required'),
  })
  .refine(
    data => {
      return new Date(data.dueDate) >= new Date(data.rentalDate)
    },
    {
      message: 'Due date must be on or after rental date',
      path: ['dueDate'],
    }
  )

type BookOutForm = z.infer<typeof bookOutSchema>

export default function Book() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const { defaultStoreLocation, setLastActionProductId } = useUiStore()

  const preselectedProductId = searchParams.get('productId')
  const [preselectedProduct, setPreselectedProduct] = useState<Product | null>(null)

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<BookOutForm>({
    resolver: zodResolver(bookOutSchema),
    defaultValues: {
      productId: '',
      rentalDate: formatDateForInput(getCurrentDate()),
      storeLocation: defaultStoreLocation,
    },
  })

  // Watch form values
  const selectedStoreLocation = watch('storeLocation')
  const selectedProductId = watch('productId')
  const staffName = watch('staffName')
  const rentalDate = watch('rentalDate')
  const dueDate = watch('dueDate')

  // Subscribe to all available products
  useEffect(() => {
    const unsubscribe = subscribeToProducts(products => {
      const available = products.filter(p => p.status === 'Available')
      setAllProducts(available)

      if (preselectedProductId) {
        const preselected = available.find(p => p.id === preselectedProductId)
        if (preselected) {
          setPreselectedProduct(preselected)
          setValue('storeLocation', preselected.storeLocation)
          setValue('productId', preselected.id)
        }
      }
    })
    return unsubscribe
  }, [preselectedProductId, setValue])

  const onSubmit = async (data: BookOutForm) => {
    try {
      await bookOutProduct(data)
      setLastActionProductId(data.productId)
      toast.success('Product booked out successfully')
      navigate('/products')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to book out product')
    }
  }

  return (
    <div>
      <div className="flex justify-center items-center mb-6 relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/products')}
          className="absolute left-0"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>
        <h2 className="text-2xl font-bold">Book Out Product</h2>
      </div>

      <div className="flex justify-center">
        <div className="w-full max-w-md">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Product Selection */}
            <ProductSelector
              storeLocation={selectedStoreLocation}
              productId={selectedProductId}
              products={allProducts}
              preselectedProduct={preselectedProduct}
              onStoreLocationChange={value => setValue('storeLocation', value)}
              onProductChange={value => setValue('productId', value)}
              error={errors.productId?.message}
            />

            {/* Booking Form Fields */}
            <BookingFormFields
              staffName={staffName}
              rentalDate={rentalDate}
              dueDate={dueDate}
              onStaffNameChange={value => setValue('staffName', value)}
              onRentalDateChange={value => setValue('rentalDate', value)}
              onDueDateChange={value => setValue('dueDate', value)}
              errors={{
                staffName: errors.staffName?.message,
                rentalDate: errors.rentalDate?.message,
                dueDate: errors.dueDate?.message,
              }}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => navigate('/products')}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Booking Out...' : 'Book Out Product'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
