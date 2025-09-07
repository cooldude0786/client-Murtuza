import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

// SVG Icon components for clarity
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const CartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);
const LogoutIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2h5a2 2 0 012 2v1"
    />
  </svg>
);


const Navbar = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // 2. Add state for the search input
  const navigate = useNavigate(); // 3. Initialize the navigate function
  const { cartItems } = useCart(); //  Get cart state
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0); // calculate total quantity

  const handleSearchSubmit = (e) => {
    e.preventDefault(); // Prevent the form from reloading the page
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`); // Navigate to the search results page
      // setSearchQuery(''); // Optional: clear the search bar after submission
    }
  };

  return (
    // 1. Make the main nav container a padded element to provide space
    <nav className="bg-base-100 shadow-lg sticky top-0 z-50">

      {/* 2. Create an inner container for the content */}
      <div className="container mx-auto rounded-b-2xl shadow-lg">
        <div className="flex justify-between items-center py-4 px-4">

          {/* Brand Logo */}
          <Link href="/" className="text-3xl font-extrabold text-base-content">
            MyStore
          </Link>

          {/* Search Bar (Desktop) */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-grow max-w-xl mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                <SearchIcon />
              </div>
              <input
                type="search"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-base-200 border-2 border-transparent rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring:primary transition-colors"
              />
            </div>
          </form>

          {/* Action Icons (Desktop) */}
          <div data-testid="desktop-nav" className="hidden md:flex items-center space-x-5">
            {user ? (
              <>
                <Link to="/my-orders" className="font-medium text-base-content/80 hover:text-primary">My Orders</Link>
                <button onClick={logout} className="btn btn-ghost flex items-center gap-2">
                  Logout
                  <LogoutIcon />
                </button>
              </>
            ) : (
              <Link to="/login" className="btn btn-ghost flex items-center gap-2">
                <UserIcon />
                <span className="ml-2 font-medium">Login/Signup</span>
              </Link>
            )}

            <Link
              to="/cart"
              className="flex items-center text-base-content/80 hover:text-primary transition-colors duration-200"
            >{totalItems > 0 && (
              <span className="indicator-item badge badge-primary">{totalItems}</span>
            )}
              <CartIcon />
              <span className="ml-2 font-medium">Cart</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-base-content  hover:bg-base-200">
              {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* Mobile Menu (Collapsible) - now inside the rounded container */}
        <div data-testid="mobile-nav" className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out transform 
  ${isMenuOpen ? 'max-h-96 opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-2'}
`}>
          <div className="px-4 pt-2 pb-4 space-y-4 border-t bg-base-200">
            {/* Search Bar (Mobile) */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                <SearchIcon />
              </div>
              <input type="search" placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-100 border-2 border-transparent rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-primary transition-colors" />
            </form>
            {/* Action Links (Mobile) */}
            {user ? (
              <>
                <button onClick={logout} className="btn btn-ghost flex items-center hover:text-primary gap-2">
                <Link to="/my-orders" className="font-medium text-base-content/80 ">My Orders</Link>
                </button>
                <button onClick={logout} className="btn btn-ghost flex items-center gap-2">
                  Logout
                  <LogoutIcon />
                </button>
              </>

            ) : (
              <Link href="/login" className="flex items-center ...">
                <UserIcon />
                <span className="ml-2 font-medium">Login/Signup</span>
              </Link>
            )}
            <Link to="/cart" className="flex items-center text-base-content  hover:bg-base-200  transition-colors py-2">
              <CartIcon />
              <span className="ml-2 font-medium">Cart</span>
            </Link>
          </div>
        </div>

      </div>
    </nav >
  );
};



export default Navbar;