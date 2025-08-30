import { Link, useLocation } from 'react-router-dom'
import { Package, UserPlus, History } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Navigation() {
  const location = useLocation()
  
  const navItems = [
    { path: '/products', label: 'Products', icon: Package },
    { path: '/book', label: 'Book Out', icon: UserPlus },
    { path: '/rentals', label: 'Rentals', icon: History },
  ]
  
  return (
    <nav className="border-b bg-card">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Package className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Staff Rental Tracker</h1>
          </div>
          
          <div className="flex space-x-2">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Button
                key={path}
                variant={location.pathname === path ? 'default' : 'ghost'}
                size="sm"
                asChild
              >
                <Link to={path} className="flex items-center space-x-2">
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}