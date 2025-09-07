import React, { useState, useEffect } from 'react';
import apiClient from '../api/axios';
import { Link } from 'react-router-dom';

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await apiClient.get('/api/orders/myorders');
        setOrders(response.data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);


  if (loading) {
    return <div className="text-center p-10"><span className="loading loading-lg"></span></div>;
  }

  if (orders.length === 0) {
    return (
      <div className="text-center p-10">
        <h1 className="text-3xl font-bold mb-4">You have no orders yet.</h1>
        <Link to="/products" className="btn btn-primary">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-base-200">
      <div className="container mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">My Orders</h1>
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order._id} className="card bg-base-100 shadow-md">
              <div className="card-body">
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start pb-4 border-b border-base-200">
                  <div>
                    <h2 className="card-title">Order #{order._id}</h2>
                    <p className="text-sm text-base-content/70">
                      Date: {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className={`badge mt-2 sm:mt-0 ${
                    order.paymentStatus === 'Pending Payment' ? 'badge-warning' : 'badge-success'
                  }`}>
                    {order.paymentStatus}
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-2 py-4">
                  {order.orderItems.map(item => (
                    <div key={item.product} className="flex justify-between items-center">
                      <span>{item.name} <span className="text-base-content/70">x {item.quantity}</span></span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Billing Summary */}
                <div className="border-t border-base-200 pt-4 space-y-2">
                  <div className="flex justify-between"><span>Subtotal</span><span>${order.billingDetails.subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Shipping</span><span>${order.billingDetails.shipping.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Tax</span><span>${order.billingDetails.tax.toFixed(2)}</span></div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${order.billingDetails.total.toFixed(2)}</span>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyOrdersPage;