import { render, screen } from '@testing-library/react';
// The import path now starts with '../src/'
import Header from '../src/components/Header'; 
import { describe, expect, it } from 'vitest';

describe('Header Component', () => {
  it('should render the main heading correctly', () => {
    render(<Header />);
    const headingElement = screen.getByText(/my e-commerce store/i);
    expect(headingElement).toBeInTheDocument();
  });
});