import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import Navigation from '@/components/Navigation'
import Products from '@/routes/Products'
import Book from '@/routes/Book'
import Rentals from '@/routes/Rentals'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Navigate to="/products" replace />} />
            <Route path="/products" element={<Products />} />
            <Route path="/book" element={<Book />} />
            <Route path="/rentals" element={<Rentals />} />
          </Routes>
        </main>
        <Toaster />
      </div>
    </Router>
  )
}

export default App