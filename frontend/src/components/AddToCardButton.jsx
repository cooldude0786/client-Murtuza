import React from 'react';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';

const AddToCartButton = ({ product }) => {
  const { cartItems, addToCart, updateQuantity } = useCart();
  const itemInCart = cartItems.find(item => item.id === product.id);

  return (
    <div className="flex items-center gap-2">
      {itemInCart ? (
        // No animation wrapper — just static render
        <div className="flex items-center space-x-2">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => updateQuantity(product.id, -1)}
            className="btn btn-sm btn-circle btn-secondary"
          >
            -
          </motion.button>
          <span className="font-bold text-lg w-8 text-center">
            {itemInCart.quantity}
          </span>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => updateQuantity(product.id, 1)}
            className="btn btn-sm btn-circle btn-secondary"
          >
            +
          </motion.button>
        </div>
      ) : (
        // Keep hover and tap animation but no mount/unmount animation
        <motion.button
          onClick={() => addToCart(product)}
          className="btn btn-secondary"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Add to Cart
        </motion.button>
      )}

     
    </div>
  );
};

export default AddToCartButton;
