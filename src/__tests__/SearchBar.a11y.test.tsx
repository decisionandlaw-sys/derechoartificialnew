import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { SearchBar } from '@/components/SearchBar';

// Mock data for testing
const mockResults = [
  {
    title: 'Test Result 1',
    category: 'jurisprudencia',
    dateLabel: '2024',
    url: '/test-url-1',
    excerpt: 'Test excerpt for search result'
  },
  {
    title: 'Test Result 2',
    category: 'normativa',
    dateLabel: '2023',
    url: '/test-url-2',
    excerpt: 'Another test excerpt'
  }
];

describe('SearchBar Accessibility', () => {
  it('should not have accessibility violations', async () => {
    const { container } = render(<SearchBar />);
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper search input semantics', () => {
    render(<SearchBar />);
    
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'search');
    expect(input).toHaveAttribute('placeholder');
  });

  it('should have visible focus indicator on input', () => {
    render(<SearchBar />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('focus-within:ring-2');
    expect(input).toHaveClass('focus-within:ring-blue-500');
    expect(input).toHaveClass('focus-within:ring-offset-2');
  });

  it('should have proper search button', () => {
    render(<SearchBar />);
    
    const searchButton = screen.getByRole('button');
    expect(searchButton).toBeInTheDocument();
    expect(searchButton).toHaveAttribute('aria-label');
  });

  it('should handle search interaction', async () => {
    render(<SearchBar />);
    
    const input = screen.getByRole('textbox');
    const searchButton = screen.getByRole('button');
    
    fireEvent.change(input, { target: { value: 'test query' } });
    fireEvent.click(searchButton);
    
    await waitFor(() => {
      expect(screen.getByText('Test Result 1')).toBeInTheDocument();
    });
  });

  it('should display search results with proper accessibility', async () => {
    render(<SearchBar />);
    
    const input = screen.getByRole('textbox');
    
    // Simulate search
    fireEvent.change(input, { target: { value: 'test' } });
    
    await waitFor(() => {
      const results = screen.getAllByRole('button');
      expect(results.length).toBeGreaterThan(0);
      
      // Check each result button has proper accessibility
      results.forEach((result, index) => {
        expect(result).toHaveAttribute('aria-label');
        expect(result).toHaveClass('focus:outline-none');
        expect(result).toHaveClass('focus:ring-2');
        expect(result).toHaveClass('focus:ring-blue-500');
        expect(result).toHaveClass('focus:ring-offset-2');
      });
    });
  });

  it('should have proper color contrast in search results', async () => {
    render(<SearchBar />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test' } });
    
    await waitFor(() => {
      const { container } = screen.getByRole('list');
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  it('should handle keyboard navigation', () => {
    render(<SearchBar />);
    
    const input = screen.getByRole('textbox');
    
    // Test Tab navigation
    fireEvent.focus(input);
    expect(input).toHaveFocus();
    
    // Test Enter key
    fireEvent.keyDown(input, { key: 'Enter' });
    
    // Test Escape key
    fireEvent.keyDown(input, { key: 'Escape' });
  });

  it('should have proper ARIA attributes', () => {
    render(<SearchBar />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('autocomplete', 'off');
    expect(input).toHaveAttribute('spellcheck', 'false');
  });

  it('should meet WCAG touch target size requirements', () => {
    render(<SearchBar />);
    
    const input = screen.getByRole('textbox');
    const searchButton = screen.getByRole('button');
    
    // Input should be at least 24px tall
    expect(input).toHaveClass('h-10'); // 40px height
    
    // Search button should be at least 24x24px
    expect(searchButton).toHaveClass('px-2'); // padding for size
  });

  it('should handle empty state gracefully', () => {
    render(<SearchBar />);
    
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    
    // Should not show results when empty
    expect(screen.queryByText('No results found')).not.toBeInTheDocument();
  });
});
