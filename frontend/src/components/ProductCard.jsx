import React from 'react';
import { motion } from 'framer-motion'; // ✅ Import Framer Motion
import { useCart } from '../context/CartContext';
import { API_BASE_URL } from '../api/axios';
import AddToCartButton from './AddToCardButton'; // 1. Import the new component
import { Link } from 'react-router-dom';

const getImageUrl = (localPath) => {
  if (!localPath) return 'https://via.placeholder.com/300';
  const filename = localPath.split('images/')[1];
  return `${API_BASE_URL}/images/${filename}`;
};

// ✅ Define framer-motion variants
const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
};

const ProductCard = ({ product, from }) => {
  const { cartItems, addToCart, updateQuantity } = useCart();
  const itemInCart = cartItems.find(item => item.id === product.id);

  const displayImage = product.images && product.images.length > 0
    ? getImageUrl(product.images[0].path)
    : 'https://placehold.co/300';
  return (
    <motion.div
      className={`card bg-base-100 shadow-xl transition-all duration-300 hover:shadow-2xl group ${(from !== undefined) ? "" : "sm:w-[20%] md:w-[40%] lg:w-[20%] "}`}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }} // ✅ Animate on first view
    >
      <figure className="overflow-hidden">
        <img
          src={displayImage}
          alt={product.title}
          className="w-full h-48 object-contain scale-100 group-hover:scale-110 transition-transform duration-500"
        />
      </figure>
      <div className="card-body items-center text-center">
        <h2 className="card-title text-base-content">{product.title}</h2>
        <p className="text-lg font-semibold text-primary">${product.pricing.price.toFixed(2)}</p>
        <div className="card-actions">
          <AddToCartButton product={product} />
          <Link to={`/product/${product.id}`} className="btn btn-outline">
            Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
