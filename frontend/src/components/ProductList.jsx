// src/components/ProductList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Your backend API URL
import { API_BASE_URL } from '../api/axios';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // This function will run when the component mounts
    const fetchProducts = async () => {
      try {
        // Make an API call to your backend to get all calipers
        const response = await axios.get(`${API_BASE_URL}/api/products/category/calipers`);
        setProducts(response.data); // Store the fetched products in state
      } catch (err) {
        setError('Failed to fetch products.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // The empty array means this effect runs only once

  if (loading) {
    return <p>Loading products...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Calipers</h1>
      <ul>
        {products.map(product => (
          <li key={product.id}>
            {product.title} - ${product.pricing.price}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;