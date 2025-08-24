import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { motion,AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import ProductImageSlider from '../components/ProductImageSlider';
import { getImageUrl } from '../utils/image'; // Import from your new utils file
import { Link } from 'react-router-dom';

const API_BASE_URL = "http://localhost:5000/product"; // Using the correct backend route

const ProductDetailPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/byid/${productId}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const images = useMemo(() => {
    if (!product?.images?.length) return ["https://placehold.co/600"];
    return product.images.map((img) => getImageUrl(img.path));
  }, [product]);

  if (loading) return <div className="text-center p-10"><span className="loading loading-lg"></span></div>;
  if (!product) return <div className="text-center p-10">Product not found.</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-10 items-start">
        
        <div className="md:w-1/2 w-full">
          <ProductImageSlider images={images} />
        </div>

        <motion.div
          className="md:w-1/2 w-full space-y-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-base-content">{product.title}</h1>
          <p className="text-2xl text-primary font-semibold">${product.pricing.price.toFixed(2)}</p>
          <p className="text-base-content/80 leading-relaxed">{product.description}</p>
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => addToCart(product)}
            className="btn btn-primary btn-lg"
          >
            Add to Cart
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetailPage;