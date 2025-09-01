import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CategoryCard from '../src/components/CategoryCard';

describe('CategoryCard Component', () => {
  const mockCategory = {
    name: 'Electronics',
    subCategories: [
      { name: 'Laptops', slug: 'laptops' },
      { name: 'Smartphones', slug: 'smartphones' },
      { name: 'Accessories', slug: 'accessories' },
    ],
  };

  test('renders category name and subcategories', () => {
    render(
      <MemoryRouter>
        <CategoryCard category={mockCategory} />
      </MemoryRouter>
    );

    // Check category title
    expect(screen.getByText('Electronics')).toBeInTheDocument();

    // Check subcategories
    mockCategory.subCategories.forEach(sub => {
      expect(screen.getByText(sub.name)).toBeInTheDocument();
    });
  });

  test('renders correct links for each subcategory', () => {
    render(
      <MemoryRouter>
        <CategoryCard category={mockCategory} />
      </MemoryRouter>
    );

    mockCategory.subCategories.forEach(sub => {
      const link = screen.getByText(sub.name);
      expect(link.closest('a')).toHaveAttribute('href', `/all/${sub.slug}`);
    });
  });

  test('applies custom className if provided', () => {
    render(
      <MemoryRouter>
        <CategoryCard category={mockCategory} className="custom-class" />
      </MemoryRouter>
    );

    const card = screen.getByRole('heading', { name: 'Electronics' }).closest('.card');
    expect(card).toHaveClass('custom-class');
  });
});
