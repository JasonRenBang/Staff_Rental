import { Link, useLocation } from 'react-router-dom'
import { Package, UserPlus, History, User, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuthStore } from '@/store/authStore'
import { signOutUser } from '@/lib/authApi'
import { toast } from 'sonner'

export default function Navigation() {
  const location = useLocation()
  const { userProfile } = useAuthStore()
  
  const navItems = [
    { path: '/products', label: 'Products', icon: Package },
    { path: '/book', label: 'Book Out', icon: UserPlus },
    { path: '/rentals', label: 'Rentals', icon: History },
  ]

  const handleSignOut = async () => {
    try {
      await signOutUser()
      toast.success('Signed out successfully')
    } catch {
      toast.error('Failed to sign out')
    }
  }
  
  return (
    <nav className="border-b bg-card">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Package className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Staff Rental Tracker</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Navigation Items */}
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

            {/* User Menu */}
            {userProfile && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>{userProfile.displayName}</span>
                    <Badge variant={userProfile.role === 'admin' ? 'default' : 'secondary'} className="text-xs">
                      {userProfile.role}
                    </Badge>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{userProfile.displayName}</p>
                      <p className="text-xs text-muted-foreground">{userProfile.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="flex items-center space-x-2">
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}