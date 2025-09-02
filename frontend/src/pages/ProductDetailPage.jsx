import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import ProductImageSlider from '../components/ProductImageSlider';
import { getImageUrl } from '../utils/image'; // Import from your new utils file
import { Link } from 'react-router-dom';
import apiClient from '../api/axios';

import AddToCartButton from '../components/AddToCardButton'; // 1. Import the new component

const ProductDetailPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get(`api/products/byid/${productId}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);
  // console.log(product)

  const images = useMemo(() => {
    if (!product?.images?.length) return ["https://placehold.co/600"];
    return product.images.map((img) => getImageUrl(img.path));
  }, [product]);

  if (loading) return <div className="text-center p-10"><span className="loading loading-lg"></span></div>;
  if (!product) return <div className="text-center p-10">Product not found.</div>;
console.log(images)
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
          <AddToCartButton product={product} />
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetailPage;