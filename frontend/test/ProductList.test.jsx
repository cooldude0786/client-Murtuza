import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ProductList from '../src/components/ProductList';
import axios from 'axios';

// Mock axios
vi.mock('axios');

describe('ProductList Component', () => {
  const mockProducts = [
    { id: '1', title: 'Caliper A', pricing: { price: 150 } },
    { id: '2', title: 'Caliper B', pricing: { price: 250 } },
  ];

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should display loading text while fetching data', () => {
    // Simulate pending promise
    axios.get.mockReturnValue(new Promise(() => {}));

    render(<ProductList />);
    expect(screen.getByText(/loading products.../i)).toBeInTheDocument();
  });

  it('should display products after successful API call', async () => {
    axios.get.mockResolvedValue({ data: mockProducts });

    render(<ProductList />);

    expect(await screen.findByText('Caliper A - $150')).toBeInTheDocument();
    expect(screen.getByText('Caliper B - $250')).toBeInTheDocument();
  });

  it('should display error message if API call fails', async () => {
    axios.get.mockRejectedValue(new Error('Network error'));

    render(<ProductList />);

    expect(await screen.findByText(/failed to fetch products/i)).toBeInTheDocument();
  });

  it('should display nothing under the title if no products are returned', async () => {
    axios.get.mockResolvedValue({ data: [] });

    render(<ProductList />);

    // Wait for the loading to finish
    await screen.findByText('Calipers');

    // Ensure no list items are present
    const items = screen.queryAllByRole('listitem');
    expect(items.length).toBe(0);
  });
});
