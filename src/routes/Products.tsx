import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Product } from '@/types/product'
import { subscribeToProducts, deleteProduct } from '@/lib/productApi'
import { checkInProduct } from '@/lib/rentalApi'
import { useUiStore } from '@/store/uiStore'
import CreateProductForm from '@/components/CreateProductForm'
import ProductTable from '@/components/products/ProductTable'
import DeleteProductDialog from '@/components/products/DeleteProductDialog'
import { useNavigate } from 'react-router-dom'

export default function Products() {
  const navigate = useNavigate()
  const [products, setProducts] = useState<Product[]>([])
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const {
    filterStatus,
    setFilterStatus,
    isCreateProductOpen,
    setCreateProductOpen,
    lastActionProductId,
    setLastActionProductId,
  } = useUiStore()

  // Subscribe to products
  useEffect(() => {
    const unsubscribe = subscribeToProducts(newProducts => {
      setProducts(newProducts)
    })
    return unsubscribe
  }, [])

  // Filter products based on status
  const filteredProducts = products.filter(product => {
    if (filterStatus === 'All') return true
    return product.status === filterStatus
  })

  // Handle check in
  const handleCheckIn = async (productId: string) => {
    try {
      await checkInProduct(productId)
      setLastActionProductId(productId)
      toast.success('Product checked in successfully')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to check in product')
    }
  }

  // Handle book out
  const handleBookOut = (productId: string) => {
    navigate(`/book?productId=${productId}`)
  }

  // Handle edit product
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setIsEditDialogOpen(true)
  }

  // Handle delete product
  const handleDeleteProduct = (product: Product) => {
    setProductToDelete(product)
    setIsDeleteDialogOpen(true)
  }

  // Confirm delete product
  const confirmDeleteProduct = async () => {
    if (!productToDelete) return

    setIsDeleting(true)
    try {
      await deleteProduct(productToDelete.id, productToDelete.serialNumber)
      toast.success('Product deleted successfully')
      setIsDeleteDialogOpen(false)
      setProductToDelete(null)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete product')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Product Management</h2>
        <Dialog open={isCreateProductOpen} onOpenChange={setCreateProductOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <CreateProductForm />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter */}
      <div className="mb-4">
        <Select
          value={filterStatus}
          onValueChange={(value: 'All' | 'Available' | 'Rented') => setFilterStatus(value)}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Products</SelectItem>
            <SelectItem value="Available">Available</SelectItem>
            <SelectItem value="Rented">Rented Out</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Products Table */}
      <ProductTable
        products={filteredProducts}
        lastActionProductId={lastActionProductId}
        onCheckIn={handleCheckIn}
        onBookOut={handleBookOut}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
      />

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <CreateProductForm
              editingProduct={editingProduct}
              onSuccess={() => {
                setIsEditDialogOpen(false)
                setEditingProduct(null)
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteProductDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        product={productToDelete}
        onConfirm={confirmDeleteProduct}
        isLoading={isDeleting}
      />
    </div>
  )
}
