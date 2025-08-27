import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../api/axios';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';
import { motion } from 'framer-motion';

const BrandProductsPage = () => {
    const { brandName } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await apiClient.get(`/product/brand/${brandName}`);
                setProducts(response.data);
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    setProducts([]);
                } else {
                    console.error(`Failed to fetch products for ${brandName}:`, error);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [brandName]);

    const cardWidths = "w-full md:w-[45%] lg:w-[22%]";

    // Animation variants
    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <div className="p-8">
            <h1 className="text-4xl font-bold text-center mb-8">{brandName} Products</h1>
            <div className="flex flex-wrap justify-center gap-8">
                {loading ? (
                    <>
                        <SkeletonCard className={cardWidths} />
                        <SkeletonCard className={cardWidths} />
                        <SkeletonCard className={cardWidths} />
                        <SkeletonCard className={cardWidths} />
                    </>
                ) : products.length > 0 ? (
                    products.map((product, index) => (
                        <motion.div
                            key={product.id}
                            className={cardWidths}
                            variants={fadeInUp}
                            initial="hidden"
                            animate="visible"
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                        >
                            <ProductCard product={product} from = "" />
                        </motion.div>
                    ))
                ) : (
                    <motion.p
                        className="text-center text-lg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        No products found for this brand.
                    </motion.p>
                )}
            </div>
        </div>
    );
};

export default BrandProductsPage;
