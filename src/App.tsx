import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import Navigation from '@/components/Navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import Products from '@/routes/Products'
import Book from '@/routes/Book'
import Rentals from '@/routes/Rentals'
import Login from '@/routes/Login'
import Register from '@/routes/Register'
import Profile from '@/routes/Profile'
import { useAuthStore } from '@/store/authStore'
import { subscribeToAuthState, getUserProfile } from '@/lib/authApi'

function App() {
  const { setUser, setUserProfile, setLoading, isAuthenticated } = useAuthStore()

  // Initialize auth state
  useEffect(() => {
    const unsubscribe = subscribeToAuthState(async (user) => {
      setUser(user)
      
      if (user) {
        // Load user profile
        try {
          const profile = await getUserProfile(user.uid)
          setUserProfile(profile)
        } catch (error) {
          console.error('Failed to load user profile:', error)
        }
      } else {
        setUserProfile(null)
      }
      
      setLoading(false)
    })

    return unsubscribe
  }, [setUser, setUserProfile, setLoading])

  return (
    <Router>
      <div className="min-h-screen bg-background">
        {isAuthenticated && <Navigation />}
        <main className={isAuthenticated ? "container mx-auto px-4 py-6" : ""}>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Navigate to="/products" replace />
              </ProtectedRoute>
            } />
            <Route path="/products" element={
              <ProtectedRoute>
                <Products />
              </ProtectedRoute>
            } />
            <Route path="/book" element={
              <ProtectedRoute>
                <Book />
              </ProtectedRoute>
            } />
            <Route path="/rentals" element={
              <ProtectedRoute>
                <Rentals />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        <Toaster />
      </div>
    </Router>
  )
}

export default App