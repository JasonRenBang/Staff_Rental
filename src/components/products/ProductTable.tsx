import { Edit, Trash2, UserPlus, UserCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Product } from '@/types/product'
import { formatDate, isOverdue, isDueSoon } from '@/utils/dates'

interface ProductTableProps {
  products: Product[]
  lastActionProductId: string | null
  onCheckIn: (productId: string) => void
  onBookOut: (productId: string) => void
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
}

export default function ProductTable({
  products,
  lastActionProductId,
  onCheckIn,
  onBookOut,
  onEdit,
  onDelete,
}: ProductTableProps) {
  // Get status badge variant
  const getStatusBadgeVariant = (product: Product) => {
    if (product.status === 'Available') return 'secondary'
    if (product.currentDueDate && isOverdue(product.currentDueDate)) return 'destructive'
    if (product.currentDueDate && isDueSoon(product.currentDueDate)) return 'outline'
    return 'default'
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Store</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Renter & Due</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                No products found
              </TableCell>
            </TableRow>
          ) : (
            products.map(product => (
              <TableRow
                key={product.id}
                className={lastActionProductId === product.id ? 'bg-accent' : ''}
              >
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>{product.sku}</TableCell>
                <TableCell>{product.storeLocation}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(product)}>{product.status}</Badge>
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
                        <Button size="sm" variant="outline" onClick={() => onBookOut(product.id)}>
                          <UserPlus className="h-4 w-4 mr-1" />
                          Book Out
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => onEdit(product)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onDelete(product)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => onCheckIn(product.id)}>
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
  )
}
