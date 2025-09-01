import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import SubNavbar from '../src/components/SubNavbar'; // Adjust path as needed

// Helper to render with router context
const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('SubNavbar Component', () => {
  it('should render navigation links', () => {
    renderWithRouter(<SubNavbar />);

    expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: /products/i })).toHaveAttribute('href', '/products');
    expect(screen.getByRole('link', { name: /brands/i })).toHaveAttribute('href', '/brands');
    expect(screen.getByRole('link', { name: /contact/i })).toHaveAttribute('href', '/contact');
  });

  it('should have correct classes and layout structure', () => {
    renderWithRouter(<SubNavbar />);
    
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('flex');
    expect(nav).toHaveClass('space-x-4');
  });
});
