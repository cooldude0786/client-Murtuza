import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import ProductCard from '../src/components/ProductCard';
import { useCart } from '../src/context/CartContext';

// Mock useCart hook
vi.mock('../src/context/CartContext');

// Helper to wrap in Router
const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('ProductCard Component', () => {
  const mockAddToCart = vi.fn();
  const mockUpdateQuantity = vi.fn();

  const sampleProduct = {
    id: '1',
    title: 'Test Product',
    pricing: { price: 99.99 },
    images: [{ path: 'images/test-product.jpg' }],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render product title and price', () => {
    useCart.mockReturnValue({ cartItems: [], addToCart: mockAddToCart, updateQuantity: mockUpdateQuantity });

    renderWithRouter(<ProductCard product={sampleProduct} />);

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
  });

  it('should render product image with correct src', () => {
    useCart.mockReturnValue({ cartItems: [], addToCart: mockAddToCart, updateQuantity: mockUpdateQuantity });

    renderWithRouter(<ProductCard product={sampleProduct} />);
    const img = screen.getByRole('img');

  expect(img).toHaveAttribute('src', expect.stringContaining('/images/test-product.jpg'));
    expect(img).toHaveAttribute('alt', 'Test Product');
  });

  it('should show "Add to Cart" if item is not in cart', () => {
    useCart.mockReturnValue({ cartItems: [], addToCart: mockAddToCart, updateQuantity: mockUpdateQuantity });

    renderWithRouter(<ProductCard product={sampleProduct} />);
    const button = screen.getByRole('button', { name: /add to cart/i });

    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(mockAddToCart).toHaveBeenCalledWith(sampleProduct);
  });

  it('should show quantity controls if item is in cart', () => {
    useCart.mockReturnValue({
      cartItems: [{ id: '1', quantity: 2 }],
      addToCart: mockAddToCart,
      updateQuantity: mockUpdateQuantity,
    });

    renderWithRouter(<ProductCard product={sampleProduct} />);

    expect(screen.getByText('2')).toBeInTheDocument(); // quantity display
    const incrementBtn = screen.getByRole('button', { name: '+' });
    const decrementBtn = screen.getByRole('button', { name: '-' });

    fireEvent.click(incrementBtn);
    fireEvent.click(decrementBtn);

    expect(mockUpdateQuantity).toHaveBeenCalledWith('1', 1);
    expect(mockUpdateQuantity).toHaveBeenCalledWith('1', -1);
  });

  it('should link to the product details page', () => {
    useCart.mockReturnValue({ cartItems: [], addToCart: mockAddToCart, updateQuantity: mockUpdateQuantity });

    renderWithRouter(<ProductCard product={sampleProduct} />);
    const link = screen.getByRole('link', { name: /details/i });

    expect(link).toHaveAttribute('href', '/product/1');
  });

  it('should use fallback image if no image is provided', () => {
    useCart.mockReturnValue({ cartItems: [], addToCart: mockAddToCart, updateQuantity: mockUpdateQuantity });

    const productWithoutImage = {
      ...sampleProduct,
      images: [],
    };

    renderWithRouter(<ProductCard product={productWithoutImage} />);
    const img = screen.getByRole('img');

    expect(img).toHaveAttribute('src', expect.stringContaining('placehold.co'));
  });
});
