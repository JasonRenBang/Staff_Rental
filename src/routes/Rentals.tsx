import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { Rental } from '@/types/rental'
import { subscribeToOpenRentals, subscribeToClosedRentals } from '@/lib/rentalApi'
import { formatDate, isOverdue, isDueSoon } from '@/utils/dates'

export default function Rentals() {
  const [openRentals, setOpenRentals] = useState<Rental[]>([])
  const [closedRentals, setClosedRentals] = useState<Rental[]>([])

  // Subscribe to open rentals
  useEffect(() => {
    const unsubscribe = subscribeToOpenRentals((rentals) => {
      setOpenRentals(rentals)
    })
    return unsubscribe
  }, [])

  // Subscribe to closed rentals
  useEffect(() => {
    const unsubscribe = subscribeToClosedRentals((rentals) => {
      setClosedRentals(rentals)
    })
    return unsubscribe
  }, [])



  // Get due status badge
  const getDueBadgeVariant = (dueDate: string) => {
    if (isOverdue(dueDate)) return 'destructive'
    if (isDueSoon(dueDate)) return 'outline'
    return 'secondary'
  }

  const getDueStatusText = (dueDate: string) => {
    if (isOverdue(dueDate)) return 'Overdue'
    if (isDueSoon(dueDate)) return 'Due Soon'
    return 'On Time'
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Rental Records</h2>

      <Tabs defaultValue="current" className="w-full">
        <TabsList>
          <TabsTrigger value="current">
            Current Rentals ({openRentals.length})
          </TabsTrigger>
          <TabsTrigger value="history">
            Rental History ({closedRentals.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="mt-6">
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Serial Number</TableHead>
                  <TableHead>Staff</TableHead>
                  <TableHead>Rental Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {openRentals.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No active rentals
                    </TableCell>
                  </TableRow>
                ) : (
                  openRentals.map((rental) => (
                    <TableRow key={rental.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{rental.productSnapshot.name}</div>
                          <div className="text-sm text-muted-foreground">
                            SKU: {rental.productSnapshot.sku}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono">
                        {rental.productSnapshot.serialNumber}
                      </TableCell>
                      <TableCell>{rental.staffName}</TableCell>
                      <TableCell>{formatDate(rental.rentalDate)}</TableCell>
                      <TableCell>{formatDate(rental.dueDate)}</TableCell>
                      <TableCell>
                        <Badge variant={getDueBadgeVariant(rental.dueDate)}>
                          {getDueStatusText(rental.dueDate)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Serial Number</TableHead>
                  <TableHead>Staff</TableHead>
                  <TableHead>Rental Period</TableHead>
                  <TableHead>Return Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {closedRentals.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No rental history
                    </TableCell>
                  </TableRow>
                ) : (
                  closedRentals.map((rental) => (
                    <TableRow key={rental.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{rental.productSnapshot.name}</div>
                          <div className="text-sm text-muted-foreground">
                            SKU: {rental.productSnapshot.sku}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono">
                        {rental.productSnapshot.serialNumber}
                      </TableCell>
                      <TableCell>{rental.staffName}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{formatDate(rental.rentalDate)} - {formatDate(rental.dueDate)}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {rental.returnDate && formatDate(rental.returnDate)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}