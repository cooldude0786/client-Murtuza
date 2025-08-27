import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/axios';

const BrandsPage = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await apiClient.get('/product/brands');
        setBrands(response.data);
      } catch (error) {
        console.error("Failed to fetch brands:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBrands();
  }, []);

  if (loading) return <div className="p-8 text-center"><span className="loading loading-lg"></span></div>;

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-center mb-8">Our Brands</h1>
      <div className="container mx-auto flex flex-wrap justify-center gap-8">
        {brands.map(brand => (
          <Link 
            key={brand}
            to={`/brand/${brand}`}
            className="card w-72 bg-base-100 shadow-xl hover:shadow-2xl transition-shadow"
          >
            <div className="card-body items-center text-center">
              <h2 className="card-title text-2xl">{brand}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BrandsPage;