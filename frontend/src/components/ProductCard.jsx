import React from 'react';
import { Link } from 'react-router-dom'; // 1. Import Link
import { useCart } from '../context/CartContext'; // 2. Import the useCart hook

const API_BASE_URL = 'http://localhost:5000'; // Your backend URL

// Function to convert local backend path to a usable URL
const getImageUrl = (localPath) => {
  if (!localPath) return 'https://via.placeholder.com/300'; // Fallback image
  // This logic assumes your backend serves images from a folder mapped to '/images'
  // It splits the path and takes the actual filename
  const filename = localPath.split('images\\')[1];
  return `${API_BASE_URL}/images/${filename}`;
};

const ProductCard = ({ product, from }) => {
  const { cartItems, addToCart, updateQuantity } = useCart(); // 3. Get cart state and functions

  const itemInCart = cartItems.find(item => item.id === product.id);

  // Use the first image from the images array as the display image
  const displayImage = product.images && product.images.length > 0
    ? getImageUrl(product.images[0].path)
    : 'https://placehold.co/300'; // Fallback if no images


  return (
    <div
      className={`card bg-base-100 shadow-xl transition-all duration-300 hover:shadow-2xl group ${(from !== undefined ) ? "" : "sm:w-[20%] md:w-[40%] lg:w-[20%] "}`}
    >      <figure className="overflow-hidden">
        <img
          src={displayImage}
          alt={product.title}
          className="w-full h-48 object-contain scale-100 group-hover:scale-110 transition-transform duration-500"
        />
      </figure>
      <div className="card-body items-center text-center">
        {/* Use product.title instead of product.name */}
        <h2 className="card-title text-base-content">{product.title}</h2>
        {/* Access price from the nested pricing object */}
        <p className="text-lg font-semibold text-primary">${product.pricing.price.toFixed(2)}</p>
        <div className="card-actions">
          {/* 4. Conditionally render the button or the counter */}
          {itemInCart ? (
            <div className="flex items-center space-x-2">
              <button onClick={() => updateQuantity(product.id, -1)} className="btn btn-sm btn-circle btn-secondary">-</button>
              <span className="font-bold text-lg">{itemInCart.quantity}</span>
              <button onClick={() => updateQuantity(product.id, 1)} className="btn btn-sm btn-circle btn-secondary">+</button>
            </div>
          ) : (
            <button onClick={() => addToCart(product)} className="btn btn-secondary">Add to Cart</button>
          )}
          {/* 5. Update the "Details" button to be a Link */}
          <Link to={`/product/${product.id}`} className="btn btn-outline">Details</Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;