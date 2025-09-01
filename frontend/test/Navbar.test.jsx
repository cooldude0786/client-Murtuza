import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import Navbar from '../src/components/Navbar';
import { useAuth } from '../src/context/AuthContext';
import { useCart } from '../src/context/CartContext';

// --- Mocks Setup ---
// Mock the contexts and hooks at the top of the file
vi.mock('../src/context/AuthContext');
vi.mock('../src/context/CartContext');
vi.mock('react-router-dom', async (importOriginal) => {
  const original = await importOriginal();
  return {
    ...original,
    useNavigate: vi.fn(),
  };
});

// --- Test Suite ---
describe('Navbar Component', () => {
  // Helper function to render the component with specific mock context values
  const renderNavbar = (authValue, cartValue) => {
    useAuth.mockReturnValue(authValue);
    useCart.mockReturnValue(cartValue);
    const mockNavigate = vi.fn();
    useNavigate.mockReturnValue(mockNavigate);

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    return { mockNavigate };
  };

  beforeEach(() => {
    // Reset all mocks before each individual test
    vi.clearAllMocks();
  });

  // --- Test Cases ---

  it('should render the brand name "MyStore"', () => {
    renderNavbar({ user: null }, { cartItems: [] });
    expect(screen.getByText('MyStore')).toBeInTheDocument();
  });

  describe('Search Functionality', () => {
    it('should navigate to the search results page on form submission', async () => {
      const { mockNavigate } = renderNavbar({ user: null }, { cartItems: [] });
      const user = userEvent.setup();

      const searchInput = screen.getAllByPlaceholderText(/search.../i)[0];
      await user.type(searchInput, 'caliper');
      await user.keyboard('{enter}');

      expect(mockNavigate).toHaveBeenCalledWith('/search?q=caliper');
    });
  });

  describe('Authentication States', () => {
    it('should display the "Login/Signup" link when the user is logged out', () => {
      renderNavbar({ user: null }, { cartItems: [] });
      
      const desktopNav = screen.getByTestId('desktop-nav');
      const loginLink = within(desktopNav).getByText('Login/Signup');
      expect(loginLink).toBeInTheDocument();
    });

    it('should display the "Logout" button and call logout on click when the user is logged in', async () => {
      const mockLogout = vi.fn();
      renderNavbar({ user: { name: 'Test User' }, logout: mockLogout }, { cartItems: [] });
      const user = userEvent.setup();
      
      const desktopNav = screen.getByTestId('desktop-nav');
      const logoutButton = within(desktopNav).getByText('Logout');
      expect(logoutButton).toBeInTheDocument();

      await user.click(logoutButton);
      expect(mockLogout).toHaveBeenCalledTimes(1);
    });
  });

  describe('Cart States', () => {
    it('should not display a cart item badge when the cart is empty', () => {
      renderNavbar({ user: null }, { cartItems: [] });
      // The badge is a span with the class 'indicator-item'
      const badge = screen.queryByText(/\d+/); // Find any element with just a number
      expect(badge).toBeNull();
    });

    it('should display the correct total item count in the badge', () => {
      const mockCartItems = [{ id: '1', quantity: 2 }, { id: '2', quantity: 3 }];
      renderNavbar({ user: null }, { cartItems: mockCartItems });

      // Total quantity is 2 + 3 = 5
      expect(screen.getByText('5')).toBeInTheDocument();
    });
  });
});