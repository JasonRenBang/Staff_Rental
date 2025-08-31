import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import type { Product } from '@/types/product'

interface DeleteProductDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  product: Product | null
  onConfirm: () => void
  isLoading?: boolean
}

export default function DeleteProductDialog({
  isOpen,
  onOpenChange,
  product,
  onConfirm,
  isLoading = false
}: DeleteProductDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Product</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>Are you sure you want to delete this product?</p>
          {product && (
            <div className="p-4 bg-muted rounded-lg">
              <p className="font-medium">{product.name}</p>
              <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
              <p className="text-sm text-muted-foreground">Serial: {product.serialNumber}</p>
            </div>
          )}
          <p className="text-sm text-destructive">
            This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? 'Deleting...' : 'Delete Product'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
