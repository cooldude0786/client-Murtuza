import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import SkeletonCard from './SkeletonCard';
import apiClient from '../api/axios';

const BestSellers = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const response = await apiClient.get('/api/products/bestseller');
        const productData = response.data.map(item => item.product);
        console.log(productData)
        setProducts(productData);
      } catch (error) {
        console.error("Failed to fetch best sellers:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellers();
  }, []);

  if (error) {
    return (
      <div className="p-8 text-center text-error">
        Could not load best sellers. Please try again later.
      </div>
    );
  }

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
        {/* ✅ Add this block below */}
        {!loading && products.length === 0 && (
          <div className="text-center text-base-content/60 py-12 text-lg">
            No best seller items found
          </div>
        )}

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
              <div key={product.id} className="w-[280px]">
                <ProductCard product={product} from="bestsellers" />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default BestSellers;
