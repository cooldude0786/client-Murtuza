import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import BestSellers from '../src/components/BestSellers';
import apiClient from '../src/api/axios';

// Mock the child components to isolate the test
vi.mock('../src/components/ProductCard', () => ({
  default: ({ product }) => <div data-testid="product-card">{product.title}</div>,
}));

vi.mock('../src/components/SkeletonCard', () => ({
  default: () => <div data-testid="skeleton-card">Loading...</div>,
}));

// Mock the entire apiClient module
vi.mock('../src/api/axios');

describe('BestSellers Component', () => {
  const mockProducts = [
    { product: { id: '1', title: 'Product A', pricing: { price: 100 } } },
    { product: { id: '2', title: 'Product B', pricing: { price: 200 } } },
  ];

  beforeEach(() => {
    // Reset mocks before each test
    vi.resetAllMocks();
  });

  it('should display skeleton loaders while fetching data', () => {
    // Simulate a pending API call
    apiClient.get.mockReturnValue(new Promise(() => {}));
    
    render(<BestSellers />);

    // Check for the skeleton cards
    const skeletons = screen.getAllByTestId('skeleton-card');
    expect(skeletons.length).toBe(4);
    expect(screen.queryByTestId('product-card')).not.toBeInTheDocument();
  });

  it('should display product cards after a successful API call', async () => {
    // Simulate a successful API call
    apiClient.get.mockResolvedValue({ data: mockProducts });
    
    render(<BestSellers />);

    // Wait for the product titles to appear and assert they are there
    expect(await screen.findByText('Product A')).toBeInTheDocument();
    expect(screen.getByText('Product B')).toBeInTheDocument();

    // Ensure skeletons are gone
    expect(screen.queryByTestId('skeleton-card')).not.toBeInTheDocument();
  });

  it('should display an error message if the API call fails', async () => {
    // Simulate a failed API call
    apiClient.get.mockRejectedValue(new Error('API Error'));
    
    render(<BestSellers />);

    // Wait for the error message to appear
    const errorMessage = await screen.findByText(/could not load best sellers/i);
    expect(errorMessage).toBeInTheDocument();

    // Ensure no products or skeletons are rendered
    expect(screen.queryByTestId('product-card')).not.toBeInTheDocument();
    expect(screen.queryByTestId('skeleton-card')).not.toBeInTheDocument();
  });

  it('should display a message if no products are returned', async () => {
    // Simulate a successful call with an empty array
    apiClient.get.mockResolvedValue({ data: [] });

    render(<BestSellers />);

    // Wait for the "no items" message
    const noItemsMessage = await screen.findByText(/no best seller items found/i);
    expect(noItemsMessage).toBeInTheDocument();
  });
});