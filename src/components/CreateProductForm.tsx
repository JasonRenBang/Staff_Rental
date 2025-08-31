import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createProduct, updateProduct } from '@/lib/productApi'
import { useUiStore } from '@/store/uiStore'
import { validateSku } from '@/utils/sku'
import type { Product } from '@/types/product'

const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(100, 'Name too long'),
  sku: z
    .string()
    .min(2, 'SKU must be at least 2 characters')
    .max(40, 'SKU too long')
    .refine(validateSku, 'SKU format invalid (only letters, numbers, ., _, - allowed)'),
  description: z.string().min(1, 'Description is required').max(500, 'Description too long'),
  serialNumber: z.string().min(1, 'Serial number is required').max(50, 'Serial number too long'),
  storeLocation: z.string().min(1, 'Store location is required'),
})

type CreateProductForm = z.infer<typeof createProductSchema>

interface CreateProductFormProps {
  editingProduct?: Product
  onSuccess?: () => void
}

export default function CreateProductForm({ editingProduct, onSuccess }: CreateProductFormProps) {
  const { defaultStoreLocation, setCreateProductOpen } = useUiStore()
  const isEditing = !!editingProduct

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<CreateProductForm>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: editingProduct?.name || '',
      sku: editingProduct?.sku || '',
      description: editingProduct?.description || '',
      serialNumber: editingProduct?.serialNumber || '',
      storeLocation: editingProduct?.storeLocation || defaultStoreLocation,
    },
  })

  const onSubmit = async (data: CreateProductForm) => {
    try {
      if (isEditing && editingProduct) {
        await updateProduct(editingProduct.id, data, editingProduct.serialNumber)
        toast.success('Product updated successfully')
        onSuccess?.()
      } else {
        await createProduct(data)
        toast.success('Product created successfully')
        reset()
        setCreateProductOpen(false)
      }
    } catch (error) {
      if (error instanceof Error && error.message === 'Serial Number already exists') {
        toast.error('Serial Number already exists. Please use a different Serial Number.')
      } else {
        toast.error(isEditing ? 'Failed to update product' : 'Failed to create product')
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Product Name</Label>
        <Input id="name" {...register('name')} placeholder="e.g., Wireless Mouse" />
        {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <Label htmlFor="sku">SKU</Label>
        <Input id="sku" {...register('sku')} placeholder="e.g., MS123" className="uppercase" />
        {errors.sku && <p className="text-sm text-destructive mt-1">{errors.sku.message}</p>}
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register('description')}
          placeholder="e.g., Ergonomic mouse for demo use"
          rows={3}
        />
        {errors.description && (
          <p className="text-sm text-destructive mt-1">{errors.description.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="serialNumber">Serial Number</Label>
        <Input
          id="serialNumber"
          {...register('serialNumber')}
          placeholder="e.g., 23RHUFI2389HFSD"
        />
        {errors.serialNumber && (
          <p className="text-sm text-destructive mt-1">{errors.serialNumber.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="storeLocation">Store Location</Label>
        <Select
          value={watch('storeLocation')}
          onValueChange={value => setValue('storeLocation', value)}
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

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={() => setCreateProductOpen(false)}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? isEditing
              ? 'Updating...'
              : 'Creating...'
            : isEditing
            ? 'Update Product'
            : 'Create Product'}
        </Button>
      </div>
    </form>
  )
}
