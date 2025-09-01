import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';
import apiClient from '../api/axios';

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q'); // Get the search query from the URL (e.g., "?q=caliper")
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) return; // Don't search if the query is empty

    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get(`/api/products/search?name=${query}`);
        setProducts(response.data);
      } catch (error) {
        // Handle cases where no products are found (API returns 404)
        if (error.response && error.response.status === 404) {
          setProducts([]);
        } else {
          console.error("Failed to fetch search results:", error);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchSearchResults();
  }, [query]); // Re-run the search whenever the query in the URL changes

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Search Results for: <span className="text-primary">"{query}"</span>
      </h1>
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
                className="w-full md:w-full lg:w-[22%]"
              />
            ))
          ) : (
            <p className="text-center text-lg col-span-full">No products found matching your search.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResultsPage;