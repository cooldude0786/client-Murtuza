import React, { useMemo, useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import { getImageUrl } from "../utils/image";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import apiClient from '../api/axios'; // 1. Import your apiClient


// A simple trash icon for the remove button
const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const CartPage = () => {
    const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [checkoutError, setCheckoutError] = useState('');


    const [config, setConfig] = useState(null); // State for store config
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const response = await apiClient.get('/api/config');
                setConfig(response.data);
            } catch (error) {
                console.error("Failed to fetch store config", error);
            } finally {
                setLoading(false);
            }
        };
        fetchConfig();
    }, []);

    const handleCheckout = async () => {
        if (!user) {
            navigate("/login", { state: { from: { pathname: "/cart" } } });
            return;
        }

        // ---vvv- THIS IS THE FIX -vvv---
        // Map the cartItems from the frontend format to the backend format
        const orderData = {
            orderItems: cartItems.map(item => ({
                name: item.title,                      // Map title -> name
                quantity: item.quantity,
                image: getImageUrl(item.images[0]?.path), // Get the first image URL -> image
                price: item.pricing.price,             // Get the price from the pricing object -> price
                product: item._id,                     // Pass the product's MongoDB ID
            })),
            totalPrice: total,
        };
        // ---^^^- END OF FIX -^^^---

        setIsSubmitting(true);
        setCheckoutError('');
        try {
            // Make the API call with the correctly formatted data
            await apiClient.post('/api/orders', orderData);

            clearCart();
            alert('Order placed successfully! Please check your email for payment instructions.');
            navigate("/my-orders");
        } catch (error) {
            console.error("Failed to create order:", error);
            setCheckoutError('Failed to place order. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Calculate subtotal, shipping, taxes, and final total
    const { subtotal, shippingCost, taxAmount, total, taxRate } = useMemo(() => {
        if (!config || cartItems.length === 0) {
            return { subtotal: 0, shippingCost: 0, taxAmount: 0, total: 0 };
        }
        const sub = cartItems.reduce((total, item) => total + item.pricing.price * item.quantity, 0);
        const shipping = sub >= config.freeShippingThreshold ? 0 : config.shippingCharge;
        const tax = sub * config.taxRate;
        const finalTotal = sub + shipping + tax;
        return { subtotal: sub, shippingCost: shipping, taxAmount: tax, total: finalTotal, taxRate: config.taxRate };
    }, [cartItems, config]);


    if (loading) return <p>Loading cart...</p>;

    // Handle the case where the cart is empty
    if (cartItems.length === 0) {
        return (
            <div className="text-center p-10 flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
                <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
                <Link to="/products" className="btn btn-primary">Continue Shopping</Link>
            </div>
        );
    }

    return (
        <div className="bg-base-200 p-4 md:p-8">
            <div className="container mx-auto">
                <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Shopping Cart</h1>

                <motion.div
                    className="flex flex-col lg:flex-row gap-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Left Side: Cart Items List */}
                    <motion.div
                        className="lg:w-2/3 bg-base-100 rounded-lg shadow-md p-4 space-y-4"
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                        {cartItems.map(item => (
                            <motion.div
                                key={item.id}
                                className="flex flex-col sm:flex-row items-center gap-4 p-4 border-b border-base-200 last:border-b-0"
                                initial={{ scale: 0.98 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                {/* Product Image & Title */}
                                <div className="flex items-center sm:w-2/5">
                                    <img src={getImageUrl(item.images[0]?.path)} alt={item.title} className="w-20 h-20 object-contain rounded-md mr-4" />
                                    <div>
                                        <h2 className="font-bold">{item.title}</h2>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-sm text-error/80 hover:text-error flex items-center gap-1 mt-1 transition-transform duration-200 transform hover:scale-110"
                                        >
                                            <TrashIcon /> Remove
                                        </button>
                                    </div>
                                </div>

                                {/* Quantity Controls */}
                                <div className="flex items-center justify-center space-x-2 sm:w-1/5">
                                    <button
                                        onClick={() => updateQuantity(item.id, -1)}
                                        className="btn btn-sm btn-ghost btn-circle hover:bg-gray-200 transition-all ease-in-out duration-200 transform hover:scale-110"
                                    >
                                        -
                                    </button>
                                    <span className="font-bold text-lg w-8 text-center">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.id, 1)}
                                        className="btn btn-sm btn-ghost btn-circle hover:bg-gray-200 transition-all ease-in-out duration-200 transform hover:scale-110"
                                    >
                                        +
                                    </button>
                                </div>

                                {/* Price */}
                                <div className="text-center sm:w-1/5">
                                    <span className="text-base-content/80">${item.pricing.price.toFixed(2)}</span>
                                </div>

                                {/* Line Total */}
                                <div className="text-center sm:w-1/5 font-semibold text-lg">
                                    ${(item.pricing.price * item.quantity).toFixed(2)}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Right Side: Order Summary */}
                    <motion.div
                        className="lg:w-1/3"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                        <div className="card bg-base-100 shadow-xl lg:sticky lg:top-28">
                            <div className="card-body">
                                <h2 className="card-title text-2xl">Order Summary</h2>
                                <div className="divider my-4"></div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-base">
                                        <span>Subtotal</span>
                                        <span className="font-medium">${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-base">
                                        <span>Shipping</span>
                                        <span className="font-medium">${shippingCost.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-base">
                                        <span>Taxes ({(taxRate * 100).toFixed(0)}%)</span>
                                        <span className="font-medium">${taxAmount.toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="divider my-4"></div>

                                <div className="flex justify-between text-xl font-bold">
                                    <span>Total</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>

                                <motion.div
                                    className="form-control mt-6"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3, duration: 0.5 }}
                                >
                                    <label className="label">
                                        <span className="label-text">Have a promo code?</span>
                                    </label>
                                    <div className="input-group">
                                        <input type="text" placeholder="Promo code" className="input input-bordered w-full" />
                                        <button className="btn">Apply</button>
                                    </div>
                                </motion.div>

                                <motion.div
                                    className="card-actions mt-6"
                                    initial={{ y: 50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.5, duration: 0.5 }}
                                >
                                    <button
                                        onClick={handleCheckout}
                                        className="btn btn-primary w-full"
                                        disabled={isSubmitting} // Disable button while processing
                                    >
                                        {isSubmitting ? <span className="loading loading-spinner"></span> : 'Proceed to Checkout'}
                                    </button>
                                    {checkoutError && <p className="text-error text-sm mt-2">{checkoutError}</p>}

                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default CartPage;
