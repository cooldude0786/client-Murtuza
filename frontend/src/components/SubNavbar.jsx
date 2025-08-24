import React from 'react';
import { Link } from 'react-router-dom'; // 1. Import Link
import '../App.css';
const SubNavbar = () => {
  return (
    <div className="bg-base-200 text-base-content">
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center h-12">
          <nav className="flex space-x-4 md:space-x-8 text-sm md:text-base">
            {/* 2. Replace all <a> tags with <Link> tags */}
            <Link to="/" className="px-3 py-2 rounded-md font-medium hover:bg-base-300  transition-colors">
              Home
            </Link>
            <Link to="/products" className="px-3 py-2 rounded-md font-medium hover:bg-base-300  transition-colors">
              Products
            </Link>
            <Link to="/brands" className="px-3 py-2 rounded-md font-medium hover:bg-base-300  transition-colors">
              Brands
            </Link>
            <Link to="/contact" className="px-3 py-2 rounded-md font-medium hover:bg-base-300  transition-colors">
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default SubNavbar;