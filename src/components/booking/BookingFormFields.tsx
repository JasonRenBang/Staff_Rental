import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface BookingFormFieldsProps {
  staffName: string
  rentalDate: string
  dueDate: string
  onStaffNameChange: (value: string) => void
  onRentalDateChange: (value: string) => void
  onDueDateChange: (value: string) => void
  errors?: {
    staffName?: string
    rentalDate?: string
    dueDate?: string
  }
}

export default function BookingFormFields({
  staffName,
  rentalDate,
  dueDate,
  onStaffNameChange,
  onRentalDateChange,
  onDueDateChange,
  errors = {}
}: BookingFormFieldsProps) {
  return (
    <div className="space-y-4">
      {/* Staff Name */}
      <div>
        <Label htmlFor="staffName">Staff Name</Label>
        <Input
          id="staffName"
          type="text"
          placeholder="Enter staff member's name"
          value={staffName}
          onChange={(e) => onStaffNameChange(e.target.value)}
        />
        {errors.staffName && (
          <p className="text-sm text-destructive mt-1">{errors.staffName}</p>
        )}
      </div>

      {/* Rental Date */}
      <div>
        <Label htmlFor="rentalDate">Rental Date</Label>
        <Input
          id="rentalDate"
          type="date"
          value={rentalDate}
          onChange={(e) => onRentalDateChange(e.target.value)}
        />
        {errors.rentalDate && (
          <p className="text-sm text-destructive mt-1">{errors.rentalDate}</p>
        )}
      </div>

      {/* Due Date */}
      <div>
        <Label htmlFor="dueDate">Due Date</Label>
        <Input
          id="dueDate"
          type="date"
          value={dueDate}
          onChange={(e) => onDueDateChange(e.target.value)}
        />
        {errors.dueDate && (
          <p className="text-sm text-destructive mt-1">{errors.dueDate}</p>
        )}
      </div>
    </div>
  )
}
