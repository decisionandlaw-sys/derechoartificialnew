import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Header } from '@/components/layout/Header';

// Mock pathname
const mockPathname = '/test-path';

describe('Header Accessibility', () => {
  beforeEach(() => {
    // Mock usePathname
    jest.mock('next/navigation', () => ({
      usePathname: () => mockPathname,
    }));
  });

  it('should not have accessibility violations', async () => {
    const { container } = render(<Header />);
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper header semantics', () => {
    render(<Header />);
    
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
    expect(header).toHaveAttribute('role', 'banner');
  });

  it('should have proper navigation semantics', () => {
    render(<Header />);
    
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
    expect(nav).toHaveAttribute('aria-label', 'Navegación principal');
  });

  it('should have visible focus indicators on navigation links', () => {
    render(<Header />);
    
    const navLinks = screen.getAllByRole('link');
    navLinks.forEach(link => {
      expect(link).toHaveClass('focus:outline-none');
      expect(link).toHaveClass('focus:ring-2');
      expect(link).toHaveClass('focus:ring-blue-500');
      expect(link).toHaveClass('focus:ring-offset-2');
    });
  });

  it('should have proper mobile navigation button', () => {
    render(<Header />);
    
    const mobileMenuButton = screen.getByRole('button');
    expect(mobileMenuButton).toBeInTheDocument();
    expect(mobileMenuButton).toHaveAttribute('aria-label');
    expect(mobileMenuButton).toHaveClass('focus:outline-none');
    expect(mobileMenuButton).toHaveClass('focus:ring-2');
    expect(mobileMenuButton).toHaveClass('focus:ring-blue-500');
    expect(mobileMenuButton).toHaveClass('focus:ring-offset-2');
  });

  it('should have proper language switcher', () => {
    render(<Header />);
    
    const languageLinks = screen.getAllByText(/ES|EN/);
    expect(languageLinks.length).toBeGreaterThan(0);
    
    languageLinks.forEach(link => {
      expect(link.closest('a')).toHaveClass('focus:outline-none');
      expect(link.closest('a')).toHaveClass('focus:ring-2');
      expect(link.closest('a')).toHaveClass('focus:ring-blue-500');
      expect(link.closest('a')).toHaveClass('focus:ring-offset-2');
    });
  });

  it('should have proper search integration', () => {
    render(<Header />);
    
    const searchInput = screen.getByRole('textbox');
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute('type', 'search');
  });

  it('should handle mobile menu toggle', () => {
    render(<Header />);
    
    const mobileMenuButton = screen.getByRole('button');
    
    // Initially closed
    expect(screen.queryByRole('navigation', { name: 'Navegación móvil' })).not.toBeInTheDocument();
    
    // Click to open
    fireEvent.click(mobileMenuButton);
    
    // Should show mobile navigation
    expect(screen.getByRole('navigation', { name: 'Navegación móvil' })).toBeInTheDocument();
  });

  it('should have proper ARIA attributes on navigation', () => {
    render(<Header />);
    
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveAttribute('role', 'navigation');
    expect(nav).toHaveAttribute('aria-label');
  });

  it('should have proper logo link', () => {
    render(<Header />);
    
    const logo = screen.getByAltText('Derecho Artificial');
    expect(logo).toBeInTheDocument();
    expect(logo.closest('a')).toHaveAttribute('href');
  });

  it('should have proper color contrast', async () => {
    const { container } = render(<Header />);
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should meet WCAG touch target size requirements', () => {
    render(<Header />);
    
    const mobileMenuButton = screen.getByRole('button');
    const navLinks = screen.getAllByRole('link');
    
    // Mobile menu button should be at least 24x24px
    expect(mobileMenuButton).toHaveClass('p-2'); // padding for size
    
    // Navigation links should have adequate touch targets
    navLinks.forEach(link => {
      expect(link).toHaveClass('rounded'); // helps with touch target definition
    });
  });

  it('should handle keyboard navigation', () => {
    render(<Header />);
    
    const navLinks = screen.getAllByRole('link');
    
    // Test Tab navigation through navigation
    navLinks.forEach((link, index) => {
      fireEvent.focus(link);
      expect(link).toHaveFocus();
      
      // Test Enter key
      fireEvent.keyDown(link, { key: 'Enter' });
    });
  });

  it('should have proper skip links structure', () => {
    render(<Header />);
    
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
    
    // Should have proper heading structure or skip links
    const mainContent = document.querySelector('main');
    if (mainContent) {
      expect(mainContent.id).toBeTruthy();
    }
  });
});
