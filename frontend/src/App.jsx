import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import SubNavbar from './components/SubNavbar';
import VerifyOtpPage from './pages/VerifyOtpPage';

// Import your page components
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import BrandsPage from './pages/BrandsPage';
import ContactPage from './pages/ContactPage';
import Footer from './components/Footer';
import AllProductsPage from './pages/AllProductsPage'; // 1. Import the new page
import SearchResultsPage from './pages/SearchResultsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import BrandProductsPage from './pages/BrandProductsPage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import CartPage from './pages/CartPage';
import ProtectedRoute from './components/ProtectedRoute'; // <-- ADD THIS LINE
import MyOrdersPage from './pages/MyOrdersPage';

function App() {
  return (
    // Change bg-gray-100 to a semantic theme color like bg-base-200
    <div className="bg-base-200 min-h-screen flex flex-col">
      <header className="sticky top-0 z-50">
        <Navbar />
        <SubNavbar />
      </header>

      <main className='flex-grow'>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/verify-otp" element={<VerifyOtpPage />} />
          <Route path="/brands" element={<BrandsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/all/:subSlug" element={<AllProductsPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/product/:productId" element={<ProductDetailPage />} />
          <Route path="/brands" element={<BrandsPage />} />
          <Route path="/brand/:brandName" element={<BrandProductsPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-orders"
            element={
              <ProtectedRoute>
                <MyOrdersPage />
              </ProtectedRoute>
            }
          />

        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;