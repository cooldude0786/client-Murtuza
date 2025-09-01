import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AddToCartButton from '../src/components/AddToCardButton';
import { useCart } from '../src/context/CartContext';
import { vi } from 'vitest';

// ✅ Mock the CartContext
vi.mock('../src/context/CartContext', () => {
  return {
    useCart: vi.fn(),
  };
});

describe('AddToCartButton', () => {
  const mockProduct = {
    id: '1',
    title: 'Sample Product',
    pricing: { price: 100 },
  };

  const addToCart = vi.fn();
  const updateQuantity = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders "Add to Cart" button if product is not in cart', () => {
    useCart.mockReturnValue({
      cartItems: [],
      addToCart,
      updateQuantity,
    });

    render(<AddToCartButton product={mockProduct} />);

    expect(screen.getByText(/add to cart/i)).toBeInTheDocument();
  });

  it('calls addToCart when "Add to Cart" button is clicked', () => {
    useCart.mockReturnValue({
      cartItems: [],
      addToCart,
      updateQuantity,
    });

    render(<AddToCartButton product={mockProduct} />);

    const addButton = screen.getByText(/add to cart/i);
    fireEvent.click(addButton);

    expect(addToCart).toHaveBeenCalledWith(mockProduct);
  });

  it('renders quantity controls if product is in cart', () => {
    useCart.mockReturnValue({
      cartItems: [{ id: '1', quantity: 2 }],
      addToCart,
      updateQuantity,
    });

    render(<AddToCartButton product={mockProduct} />);

    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('+')).toBeInTheDocument();
    expect(screen.getByText('-')).toBeInTheDocument();
  });

  it('calls updateQuantity when + or - is clicked', () => {
    useCart.mockReturnValue({
      cartItems: [{ id: '1', quantity: 2 }],
      addToCart,
      updateQuantity,
    });

    render(<AddToCartButton product={mockProduct} />);

    fireEvent.click(screen.getByText('+'));
    expect(updateQuantity).toHaveBeenCalledWith('1', 1);

    fireEvent.click(screen.getByText('-'));
    expect(updateQuantity).toHaveBeenCalledWith('1', -1);
  });
});
