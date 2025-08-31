import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Product } from '@/types/product'

interface ProductSelectorProps {
  storeLocation: string
  productId: string
  products: Product[]
  preselectedProduct: Product | null
  onStoreLocationChange: (value: string) => void
  onProductChange: (value: string) => void
  error?: string
}

export default function ProductSelector({
  storeLocation,
  productId,
  products,
  preselectedProduct,
  onStoreLocationChange,
  onProductChange,
  error
}: ProductSelectorProps) {
  // Filter products by selected store location and SKU (if from product page)
  const filteredProducts = products.filter(product => {
    if (product.storeLocation !== storeLocation) return false
    
    if (preselectedProduct) {
      return product.sku === preselectedProduct.sku
    }
    
    return true
  })

  return (
    <div className="space-y-4">
      {/* Store Location Selection */}
      <div>
        <Label htmlFor="storeLocation">Store Location</Label>
        <Select value={storeLocation} onValueChange={onStoreLocationChange}>
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
      </div>

      {/* Preselected Product Info */}
      {preselectedProduct && (
        <div className="p-4 bg-muted rounded-lg">
          <h3 className="font-medium mb-2">Selected Product</h3>
          <div className="text-sm space-y-1">
            <p><span className="font-medium">Name:</span> {preselectedProduct.name}</p>
            <p><span className="font-medium">SKU:</span> {preselectedProduct.sku}</p>
            <p><span className="font-medium">Store:</span> {preselectedProduct.storeLocation}</p>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Showing all products with SKU: {preselectedProduct.sku}
          </p>
        </div>
      )}

      {/* Product Selection */}
      <div>
        <Label htmlFor="productId">Product</Label>
        <Select value={productId} onValueChange={onProductChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select a product" />
          </SelectTrigger>
          <SelectContent>
            {filteredProducts.length === 0 ? (
              <div className="py-2 px-3 text-sm text-muted-foreground">
                No available products in {storeLocation}
              </div>
            ) : (
              filteredProducts.map((product) => (
                <SelectItem key={product.id} value={product.id}>
                  {product.name} - {product.sku} (Serial: {product.serialNumber})
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        {error && <p className="text-sm text-destructive mt-1">{error}</p>}
      </div>
    </div>
  )
}
