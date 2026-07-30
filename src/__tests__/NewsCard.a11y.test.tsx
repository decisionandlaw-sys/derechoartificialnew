import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { NewsCard } from '@/components/ui/NewsCard';

const mockProps = {
  title: 'Test News Article',
  date: '15 de marzo de 2024',
  source: 'Test Source',
  url: '/test-article',
  summary: 'This is a test summary for the news article that should be long enough to test the line clamping functionality.',
  tags: ['test', 'accessibility', 'news'],
  image: '/test-image.jpg'
};

describe('NewsCard Accessibility', () => {
  it('should not have accessibility violations', async () => {
    const { container } = render(<NewsCard {...mockProps} />);
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper article semantics', () => {
    render(<NewsCard {...mockProps} />);
    
    const article = screen.getByRole('article');
    expect(article).toBeInTheDocument();
  });

  it('should have visible focus indicators on links', () => {
    render(<NewsCard {...mockProps} />);
    
    const links = screen.getAllByRole('link');
    links.forEach(link => {
      expect(link).toHaveClass('focus:outline-none');
      expect(link).toHaveClass('focus:ring-2');
      expect(link).toHaveClass('focus:ring-blue-500');
      expect(link).toHaveClass('focus:ring-offset-2');
    });
  });

  it('should have proper heading structure', () => {
    render(<NewsCard {...mockProps} />);
    
    const title = screen.getByRole('heading');
    expect(title).toBeInTheDocument();
    expect(title).toHaveAttribute('role', 'heading');
  });

  it('should have proper image accessibility', () => {
    render(<NewsCard {...mockProps} />);
    
    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('alt', '');
    expect(image).toHaveAttribute('loading', 'lazy');
    expect(image).toHaveAttribute('decoding', 'async');
  });

  it('should have proper time element', () => {
    render(<NewsCard {...mockProps} />);
    
    const time = screen.getByRole('time');
    expect(time).toBeInTheDocument();
    expect(time).toHaveTextContent('15 de marzo de 2024');
  });

  it('should have proper source link', () => {
    render(<NewsCard {...mockProps} />);
    
    const sourceLink = screen.getByText('Test Source →');
    expect(sourceLink).toBeInTheDocument();
    expect(sourceLink.closest('a')).toHaveAttribute('href');
  });

  it('should handle external links correctly', () => {
    const externalProps = {
      ...mockProps,
      url: 'https://external-site.com/article'
    };
    
    render(<NewsCard {...externalProps} />);
    
    const externalLink = screen.getByRole('link');
    expect(externalLink).toHaveAttribute('target', '_blank');
    expect(externalLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('should have proper tag structure', () => {
    render(<NewsCard {...mockProps} />);
    
    const tags = screen.getAllByText(/test|accessibility|news/);
    expect(tags.length).toBe(3);
    
    tags.forEach(tag => {
      expect(tag).toBeInTheDocument();
    });
  });

  it('should have proper color contrast', async () => {
    const { container } = render(<NewsCard {...mockProps} />);
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should meet WCAG touch target size requirements', () => {
    render(<NewsCard {...mockProps} />);
    
    const links = screen.getAllByRole('link');
    
    // Links should have adequate touch targets
    links.forEach(link => {
      // Check if link has sufficient padding/size
      expect(link).toHaveClass('p-5'); // padding for touch target size
    });
  });

  it('should handle keyboard navigation', () => {
    render(<NewsCard {...mockProps} />);
    
    const links = screen.getAllByRole('link');
    
    // Test Tab navigation through links
    links.forEach((link, index) => {
      fireEvent.focus(link);
      expect(link).toHaveFocus();
      
      // Test Enter key
      fireEvent.keyDown(link, { key: 'Enter' });
    });
  });

  it('should have proper ARIA attributes', () => {
    render(<NewsCard {...mockProps} />);
    
    const article = screen.getByRole('article');
    expect(article).toBeInTheDocument();
    
    // Should not have redundant ARIA if semantic HTML is used
    expect(article).not.toHaveAttribute('role');
  });

  it('should handle long content properly', () => {
    const longSummary = 'This is a very long summary that should be truncated to test the line clamping functionality and ensure it works properly with the line-clamp utility class.';
    const longProps = {
      ...mockProps,
      summary: longSummary
    };
    
    render(<NewsCard {...longProps} />);
    
    const summary = screen.getByText(/This is a very long summary/);
    expect(summary).toBeInTheDocument();
    expect(summary).toHaveClass('line-clamp-2');
  });

  it('should have proper link text', () => {
    render(<NewsCard {...mockProps} />);
    
    const titleLink = screen.getByRole('heading');
    expect(titleLink).toBeInTheDocument();
    
    const sourceLink = screen.getByText('Test Source →');
    expect(sourceLink).toBeInTheDocument();
  });

  it('should be accessible without image', () => {
    const noImageProps = { ...mockProps };
    delete noImageProps.image;
    
    render(<NewsCard {...noImageProps} />);
    
    // Should not have image when no image prop
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    
    // Should still be accessible
    const article = screen.getByRole('article');
    expect(article).toBeInTheDocument();
  });
});
