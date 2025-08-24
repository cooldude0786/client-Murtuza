import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';

const API_BASE_URL = 'http://localhost:5000/product/all'; // Base API URL

const AllProductsPage = () => {
  const { subSlug } = useParams(); // Get slug from URL, e.g., "calipers"
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/${subSlug}`);
        setProducts(response.data);
      } catch (error) {
        console.error(`Failed to fetch products for ${subSlug}:`, error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [subSlug]); // Re-run effect if the slug changes

  const title = subSlug.charAt(0).toUpperCase() + subSlug.slice(1);
  const cardWidths = "w-full sm:w-[45%] md:w-[30%] lg:w-[22%] xl:w-[18%]";

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-center mb-8">All {title}</h1>
      <div className="container mx-auto">
        <div className="flex flex-wrap justify-center gap-8">
          {loading ? (
            <>
              <SkeletonCard className="w-full sm:w-[45%] lg:w-[22%]" />
              <SkeletonCard className="w-full sm:w-[45%] lg:w-[22%]" />
              <SkeletonCard className="w-full sm:w-[45%] lg:w-[22%]" />
              <SkeletonCard className="w-full sm:w-[45%] lg:w-[22%]" />
            </>
          ) : products.length > 0 ? (
            products.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                className={cardWidths} 
              />
            ))
          ) : (
            <p className="text-center col-span-full">No products found in this category.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllProductsPage;