import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CartProvider, useCart } from '../../src/context/CartContext';

const TestCartComponent = () => {
  const { cartItems, addToCart, updateQuantity } = useCart();

  return (
    <div>
      <button onClick={() => addToCart({ id: 1, name: 'Product A' })}>Add A</button>
      <button onClick={() => updateQuantity(1, -1)}>Decrease A</button>
      <ul data-testid="cart-list">
        {cartItems.map(item => (
          <li key={item.id}>{item.name} - Qty: {item.quantity}</li>
        ))}
      </ul>
    </div>
  );
};

describe('CartContext', () => {
  it('removes product when quantity is reduced to 0', () => {
    render(
      <CartProvider>
        <TestCartComponent />
      </CartProvider>
    );

    // Debug output before clicking
    screen.debug();

    // Add product to cart
    const addButton = screen.getByText('Add A');
    expect(addButton).toBeInTheDocument();

    fireEvent.click(addButton);

    // Confirm it's in the DOM
    expect(screen.getByText('Product A - Qty: 1')).toBeInTheDocument();

    // Now decrease quantity to 0
    const decreaseButton = screen.getByText('Decrease A');
    fireEvent.click(decreaseButton);

    // It should be removed
    expect(screen.queryByText(/Product A/)).not.toBeInTheDocument();
  });
});
