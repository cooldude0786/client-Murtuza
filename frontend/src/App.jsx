import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import SubNavbar from './components/SubNavbar';

// Import your page components
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import BrandsPage from './pages/BrandsPage';
import ContactPage from './pages/ContactPage';
import Footer from './components/Footer';
import AllProductsPage from './pages/AllProductsPage'; // 1. Import the new page
import SearchResultsPage from './pages/SearchResultsPage';
import ProductDetailPage from './pages/ProductDetailPage';



function App() {
  return (
    // Change bg-gray-100 to a semantic theme color like bg-base-200
    <div className="bg-base-200 min-h-screen">
      <header className="sticky top-0 z-50">
        <Navbar />
        <SubNavbar />
      </header>

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/brands" element={<BrandsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          {/* <Route path="/category/:subCategorySlug" element={<SubCategoryPage />} /> */}
          <Route path="/all/:subSlug" element={<AllProductsPage />} />
          {/* 2. Add the new route for search results */}
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/product/:productId" element={<ProductDetailPage />} />

        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;