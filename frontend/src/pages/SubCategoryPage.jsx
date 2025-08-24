import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';

const API_BASE_URL = 'http://localhost:5000/api/products/category';

const SubCategoryPage = () => {
  // useParams gets the slug from the URL (e.g., "calipers")
  const { subCategorySlug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/${subCategorySlug}`);
        setProducts(response.data);
      } catch (error) {
        console.error(`Failed to fetch products for ${subCategorySlug}:`, error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [subCategorySlug]); // Re-run this effect if the slug changes

  const title = subCategorySlug.charAt(0).toUpperCase() + subCategorySlug.slice(1);

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-center mb-8">{title}</h1>
      <div className="container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-center">
          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SubCategoryPage;