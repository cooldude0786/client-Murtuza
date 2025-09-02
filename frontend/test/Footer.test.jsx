import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Footer from '../src/components/Footer';
import apiClient from '../src/api/axios';

// Mock the API module
vi.mock('../src/api/axios');

describe('Footer Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render contact, helpful info, account, and subscription sections', () => {
    render(<Footer />);

    expect(screen.getByText(/Follow & Contact Us/i)).toBeInTheDocument();
    expect(screen.getByText(/Helpful Info/i)).toBeInTheDocument();
    expect(screen.getByText(/My Account/i)).toBeInTheDocument();
    expect(screen.getByText(/Subscribe/i)).toBeInTheDocument();
  });


  it('should render all helpful info links', () => {
    render(<Footer />);

    expect(screen.getByText('Shipping & Returns')).toHaveAttribute('href', '/shipping');
    expect(screen.getByText('Privacy Policy')).toHaveAttribute('href', '/privacy');
    expect(screen.getByText('Terms & Conditions')).toHaveAttribute('href', '/terms');
    expect(screen.getByText('FAQ')).toHaveAttribute('href', '/faq');
  });

  it('should show validation error if email is empty', async () => {
    render(<Footer />);

    const button = screen.getByRole('button', { name: /sign up/i });
    fireEvent.click(button);

    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
  });

  it('should handle successful email subscription', async () => {
    apiClient.post.mockResolvedValueOnce({ data: { message: 'Subscribed' } });

    render(<Footer />);

    const input = screen.getByPlaceholderText(/your@email.com/i);
    const button = screen.getByRole('button', { name: /sign up/i });

    fireEvent.change(input, { target: { value: 'test@example.com' } });
    fireEvent.click(button);

    expect(button).toBeDisabled(); // While loading
    expect(await screen.findByText(/subscribed successfully/i)).toBeInTheDocument();
    expect(input).toHaveValue('');
  });

  it('should handle API error on subscription', async () => {
    apiClient.post.mockRejectedValueOnce({
      response: {
        data: { error: 'Already subscribed' },
      },
    });

    render(<Footer />);

    const input = screen.getByPlaceholderText(/your@email.com/i);
    const button = screen.getByRole('button', { name: /sign up/i });

    fireEvent.change(input, { target: { value: 'test@example.com' } });
    fireEvent.click(button);

    expect(await screen.findByText(/already subscribed/i)).toBeInTheDocument();
  });

  it('should handle generic API error when no error message is returned', async () => {
    apiClient.post.mockRejectedValueOnce(new Error('Network Error'));

    render(<Footer />);

    const input = screen.getByPlaceholderText(/your@email.com/i);
    const button = screen.getByRole('button', { name: /sign up/i });

    fireEvent.change(input, { target: { value: 'test@example.com' } });
    fireEvent.click(button);

    expect(await screen.findByText(/something went wrong/i)).toBeInTheDocument();
  });
});
