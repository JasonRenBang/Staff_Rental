import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Product } from '@/types/product'
import { subscribeToProducts } from '@/lib/productApi'
import { bookOutProduct } from '@/lib/rentalApi'
import { useUiStore } from '@/store/uiStore'
import { formatDateForInput, getCurrentDate } from '@/utils/dates'

const bookOutSchema = z.object({
  productId: z.string().min(1, 'Please select a product'),
  staffName: z.string().min(1, 'Staff name is required').max(100, 'Name too long'),
  rentalDate: z.string().min(1, 'Rental date is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  storeLocation: z.string().min(1, 'Store location is required')
}).refine((data) => {
  return new Date(data.dueDate) >= new Date(data.rentalDate)
}, {
  message: "Due date must be on or after rental date",
  path: ["dueDate"]
})

type BookOutForm = z.infer<typeof bookOutSchema>

export default function Book() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const { defaultStoreLocation, setLastActionProductId } = useUiStore()
  
  const preselectedProductId = searchParams.get('productId')
  const [preselectedProduct, setPreselectedProduct] = useState<Product | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<BookOutForm>({
    resolver: zodResolver(bookOutSchema),
    defaultValues: {
      productId: '',  
      rentalDate: formatDateForInput(getCurrentDate()),
      storeLocation: defaultStoreLocation
    }
  })

  // Watch store location to filter products
  const selectedStoreLocation = watch('storeLocation')
  const selectedProductId = watch('productId')

  // Subscribe to all available products
  useEffect(() => {
    const unsubscribe = subscribeToProducts((products) => {
      const available = products.filter(p => p.status === 'Available')
      setAllProducts(available)

      if (preselectedProductId) {
        const preselected = available.find(p => p.id === preselectedProductId)
        if (preselected) {
          setPreselectedProduct(preselected)
          setValue('storeLocation', preselected.storeLocation)
          
        }
      }
    })
    return unsubscribe
  }, [preselectedProductId, setValue])

  // Filter products by selected store location and SKU (if from product page)
  const filteredProducts = allProducts.filter(product => {
    if (product.storeLocation !== selectedStoreLocation) return false
    
    if (preselectedProduct) {
      return product.sku === preselectedProduct.sku
    }
    
    return true
  })

  // Reset product selection when store location changes and current product is not in new store
  useEffect(() => {
    if (selectedProductId && !filteredProducts.find(p => p.id === selectedProductId)) {
      setValue('productId', '')
    }
  }, [selectedStoreLocation, filteredProducts, selectedProductId, setValue])

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
        {preselectedProduct && (
          <div className="mb-4 p-4 bg-muted rounded-lg">
            <h3 className="font-medium">From Product Page:</h3>
            <p className="text-sm text-muted-foreground">
              {preselectedProduct.name} (SKU: {preselectedProduct.sku})
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Location set to {preselectedProduct.storeLocation}. Showing all available products with SKU "{preselectedProduct.sku}".
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="storeLocation">Store Location</Label>
            <Select 
              value={watch('storeLocation')} 
              onValueChange={(value) => setValue('storeLocation', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select store location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CAR">CAR</SelectItem>
                <SelectItem value="SYD">SYD</SelectItem>
                <SelectItem value="MEL">MEL</SelectItem>
                <SelectItem value="BRI">BRI</SelectItem>
              </SelectContent>
            </Select>
            {errors.storeLocation && (
              <p className="text-sm text-destructive mt-1">{errors.storeLocation.message}</p>
            )}
          </div>

          <div>
          <Label htmlFor="productId">Product</Label>
          <Select 
            value={watch('productId')} 
            onValueChange={(value) => setValue('productId', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a product" />
            </SelectTrigger>
            <SelectContent>
              {filteredProducts.length === 0 ? (
                <div className="py-2 px-3 text-sm text-muted-foreground">
                  No available products in {selectedStoreLocation}
                </div>
              ) : (
                filteredProducts.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name} — {product.serialNumber}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          {errors.productId && (
            <p className="text-sm text-destructive mt-1">{errors.productId.message}</p>
          )}
        </div>

          <div>
            <Label htmlFor="staffName">Staff Name</Label>
            <Input
              id="staffName"
              {...register('staffName')}
              placeholder="e.g., John Doe"
            />
            {errors.staffName && (
              <p className="text-sm text-destructive mt-1">{errors.staffName.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="rentalDate">Rental Date</Label>
            <Input
              id="rentalDate"
              type="date"
              {...register('rentalDate')}
            />
            {errors.rentalDate && (
              <p className="text-sm text-destructive mt-1">{errors.rentalDate.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              {...register('dueDate')}
            />
            {errors.dueDate && (
              <p className="text-sm text-destructive mt-1">{errors.dueDate.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/products')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || filteredProducts.length === 0}>
              {isSubmitting ? 'Booking Out...' : 'Book Out Product'}
            </Button>
          </div>
        </form>
        </div>
      </div>
    </div>
  )
}