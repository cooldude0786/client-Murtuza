import React, { useState, useEffect } from 'react';
import CategoryCard from '../components/CategoryCard';
import apiClient from '../api/axios';

const ProductsPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.get('/api/categories');
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Loading categories...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-center mb-8">Browse Our Categories</h1>
      <div className="container mx-auto flex flex-wrap justify-center gap-8">
        {categories.map(category => (
          <CategoryCard 
            key={category._id} 
            category={category}
            // Add these width classes
            className="w-full sm:w-[45%] lg:w-[30%]"
          />
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;