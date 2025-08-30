import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, UserPlus, UserCheck } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Product } from '@/types/product'
import { subscribeToProducts, deleteProduct } from '@/lib/productApi'
import { checkInProduct } from '@/lib/rentalApi'
import { useUiStore } from '@/store/uiStore'
import { formatDate, isOverdue, isDueSoon } from '@/utils/dates'
import CreateProductForm from '@/components/CreateProductForm'
import { useNavigate } from 'react-router-dom'

export default function Products() {
  const navigate = useNavigate()
  const [products, setProducts] = useState<Product[]>([])
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const { 
    filterStatus, 
    setFilterStatus, 
    isCreateProductOpen, 
    setCreateProductOpen,
    lastActionProductId,
    setLastActionProductId 
  } = useUiStore()

  // Subscribe to products
  useEffect(() => {
    const unsubscribe = subscribeToProducts((newProducts) => {
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
    
    try {
      await deleteProduct(productToDelete.id, productToDelete.serialNumber)
      toast.success('Product deleted successfully')
      setIsDeleteDialogOpen(false)
      setProductToDelete(null)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete product')
    }
  }

  // Get status badge variant
  const getStatusBadgeVariant = (product: Product) => {
    if (product.status === 'Available') return 'secondary'
    if (product.currentDueDate && isOverdue(product.currentDueDate)) return 'destructive'
    if (product.currentDueDate && isDueSoon(product.currentDueDate)) return 'outline'
    return 'default'
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
        <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
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
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Store</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Renter & Due</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No products found
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow 
                  key={product.id}
                  className={lastActionProductId === product.id ? 'bg-accent' : ''}
                >
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>{product.storeLocation}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(product)}>
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {product.status === 'Rented' && product.currentRenterName && (
                      <div className="text-sm">
                        <div>{product.currentRenterName}</div>
                        <div className="text-muted-foreground">
                          Due: {product.currentDueDate && formatDate(product.currentDueDate)}
                        </div>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {product.status === 'Available' ? (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleBookOut(product.id)}
                          >
                            <UserPlus className="h-4 w-4 mr-1" />
                            Book Out
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditProduct(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteProduct(product)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCheckIn(product.id)}
                        >
                          <UserCheck className="h-4 w-4 mr-1" />
                          Check In
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

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
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Are you sure you want to delete this product?</p>
            {productToDelete && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-medium">{productToDelete.name}</p>
                <p className="text-sm text-muted-foreground">SKU: {productToDelete.sku}</p>
                <p className="text-sm text-muted-foreground">Serial: {productToDelete.serialNumber}</p>
              </div>
            )}
            <p className="text-sm text-destructive">
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={confirmDeleteProduct}
              >
                Delete Product
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}