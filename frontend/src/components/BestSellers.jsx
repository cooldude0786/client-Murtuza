import React, { useState, useEffect } from 'react';
import axios from 'axios'; // 1. Import axios
import ProductCard from './ProductCard';
import SkeletonCard from './SkeletonCard';

const API_URL = 'http://localhost:5000/product/bestseller'; // Your API endpoint

const BestSellers = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false); // ❗ New error state


  // 2. Replace the setTimeout with a real API call
  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const response = await axios.get(API_URL);
        // The actual product data is nested inside the 'product' key
        const productData = response.data.map(item => item.product);
        setProducts(productData);
      } catch (error) {
        console.error("Failed to fetch best sellers:", error);
        setError(true); // ❗ Set error to true on failure
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellers();
  }, []); // The empty array ensures this runs only once


  if (error) return null;

  return (
    <section className="min-h-screen w-full flex flex-col justify-center items-center py-16 px-4 bg-base-200">
      <div className="text-center">
        <h2 className="text-4xl font-extrabold text-primary mb-2">
          Our Best Sellers
        </h2>
        <p className="text-lg text-base-content/70 mb-8">
          Handpicked for you from our finest collections.
        </p>
      </div>
      <div className="container mx-auto">
        <div className="flex flex-wrap justify-center gap-8">
          {loading ? (
            <>
              <div className="w-[280px]"><SkeletonCard /></div>
              <div className="w-[280px]"><SkeletonCard /></div>
              <div className="w-[280px]"><SkeletonCard /></div>
              <div className="w-[280px]"><SkeletonCard /></div>
            </>
          ) : (
            products.map(product => (
              <div key={product.id} className="w-[280px]" >
                <ProductCard product={product}  from="bestsellers" />
              </div>
            ))
          )}
        </div>
      </div>

    </section>
  );
};

export default BestSellers;