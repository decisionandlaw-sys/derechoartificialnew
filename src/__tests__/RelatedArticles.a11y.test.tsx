import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { RelatedArticles } from '@/components/RelatedArticles';

const mockArticles = [
  {
    url: '/test-article-1',
    frontmatter: {
      title: 'Test Article 1',
      date: '2024-03-15',
      category: 'jurisprudencia',
      excerpt: 'This is a test excerpt for the first related article.'
    }
  },
  {
    url: '/test-article-2',
    frontmatter: {
      title: 'Test Article 2',
      date: '2024-03-10',
      category: 'normativa',
      excerpt: 'This is a test excerpt for the second related article with longer content to test line clamping.'
    }
  },
  {
    url: '/test-article-3',
    frontmatter: {
      title: 'Test Article 3',
      date: '2024-03-05',
      category: 'etica-ia',
      excerpt: 'Third test article excerpt.'
    }
  }
];

// Mock the getRelatedPosts function
jest.mock('@/lib/mdx-utils', () => ({
  getRelatedPosts: jest.fn(() => mockArticles)
}));

describe('RelatedArticles Accessibility', () => {
  it('should not have accessibility violations', async () => {
    const mockPost = {
      url: '/current-article',
      frontmatter: {
        title: 'Current Article',
        category: 'test-category',
        tags: ['tag1', 'tag2']
      }
    };

    const { container } = render(<RelatedArticles currentPost={mockPost} />);
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper section semantics', () => {
    const mockPost = {
      url: '/current-article',
      frontmatter: {
        title: 'Current Article',
        category: 'test-category',
        tags: ['tag1', 'tag2']
      }
    };

    render(<RelatedArticles currentPost={mockPost} />);
    
    const section = screen.getByRole('region');
    expect(section).toBeInTheDocument();
  });

  it('should have proper heading structure', () => {
    const mockPost = {
      url: '/current-article',
      frontmatter: {
        title: 'Current Article',
        category: 'test-category',
        tags: ['tag1', 'tag2']
      }
    };

    render(<RelatedArticles currentPost={mockPost} />);
    
    const heading = screen.getByRole('heading');
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Artículos relacionados');
  });

  it('should have visible focus indicators on article links', () => {
    const mockPost = {
      url: '/current-article',
      frontmatter: {
        title: 'Current Article',
        category: 'test-category',
        tags: ['tag1', 'tag2']
      }
    };

    render(<RelatedArticles currentPost={mockPost} />);
    
    const articleLinks = screen.getAllByRole('link');
    articleLinks.forEach(link => {
      expect(link).toHaveClass('focus:outline-none');
      expect(link).toHaveClass('focus:ring-2');
      expect(link).toHaveClass('focus:ring-blue-500');
      expect(link).toHaveClass('focus:ring-offset-2');
    });
  });

  it('should display articles with proper structure', () => {
    const mockPost = {
      url: '/current-article',
      frontmatter: {
        title: 'Current Article',
        category: 'test-category',
        tags: ['tag1', 'tag2']
      }
    };

    render(<RelatedArticles currentPost={mockPost} />);
    
    // Check that all articles are displayed
    const articleLinks = screen.getAllByRole('link');
    expect(articleLinks.length).toBe(3);
    
    // Check first article
    expect(screen.getByText('Test Article 1')).toBeInTheDocument();
    expect(screen.getByText('2024-03-15')).toBeInTheDocument();
    expect(screen.getByText('jurisprudencia')).toBeInTheDocument();
  });

  it('should have proper time elements', () => {
    const mockPost = {
      url: '/current-article',
      frontmatter: {
        title: 'Current Article',
        category: 'test-category',
        tags: ['tag1', 'tag2']
      }
    };

    render(<RelatedArticles currentPost={mockPost} />);
    
    const times = screen.getAllByRole('time');
    expect(times.length).toBe(3);
    
    times.forEach(time => {
      expect(time).toBeInTheDocument();
    });
  });

  it('should have proper category badges', () => {
    const mockPost = {
      url: '/current-article',
      frontmatter: {
        title: 'Current Article',
        category: 'test-category',
        tags: ['tag1', 'tag2']
      }
    };

    render(<RelatedArticles currentPost={mockPost} />);
    
    const categories = screen.getAllByText(/jurisprudencia|normativa|etica-ia/);
    expect(categories.length).toBe(3);
    
    categories.forEach(category => {
      expect(category).toBeInTheDocument();
      expect(category).toHaveClass('rounded-full'); // helps with touch target definition
    });
  });

  it('should handle excerpts properly', () => {
    const mockPost = {
      url: '/current-article',
      frontmatter: {
        title: 'Current Article',
        category: 'test-category',
        tags: ['tag1', 'tag2']
      }
    };

    render(<RelatedArticles currentPost={mockPost} />);
    
    const excerpts = screen.getAllByText(/test excerpt/);
    expect(excerpts.length).toBe(3);
    
    excerpts.forEach(excerpt => {
      expect(excerpt).toBeInTheDocument();
      expect(excerpt).toHaveClass('line-clamp-2');
    });
  });

  it('should meet WCAG touch target size requirements', () => {
    const mockPost = {
      url: '/current-article',
      frontmatter: {
        title: 'Current Article',
        category: 'test-category',
        tags: ['tag1', 'tag2']
      }
    };

    render(<RelatedArticles currentPost={mockPost} />);
    
    const articleLinks = screen.getAllByRole('link');
    
    // Links should have adequate touch targets
    articleLinks.forEach(link => {
      // Check if link has sufficient padding/size
      expect(link).toHaveClass('p-5'); // padding for touch target size
      expect(link).toHaveClass('rounded-lg'); // helps with touch target definition
    });
  });

  it('should handle empty state gracefully', () => {
    const mockPost = {
      url: '/current-article',
      frontmatter: {
        title: 'Current Article',
        category: 'test-category',
        tags: ['no-matching-tags']
      }
    };

    // Mock getRelatedPosts to return empty array
    jest.mock('@/lib/mdx-utils', () => ({
      getRelatedPosts: jest.fn(() => [])
    }));

    render(<RelatedArticles currentPost={mockPost} />);
    
    expect(screen.getByText('Próximamente más análisis relacionados.')).toBeInTheDocument();
    expect(screen.queryAllByRole('link')).toHaveLength(0);
  });

  it('should have proper color contrast', async () => {
    const mockPost = {
      url: '/current-article',
      frontmatter: {
        title: 'Current Article',
        category: 'test-category',
        tags: ['tag1', 'tag2']
      }
    };

    const { container } = render(<RelatedArticles currentPost={mockPost} />);
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should handle keyboard navigation', () => {
    const mockPost = {
      url: '/current-article',
      frontmatter: {
        title: 'Current Article',
        category: 'test-category',
        tags: ['tag1', 'tag2']
      }
    };

    render(<RelatedArticles currentPost={mockPost} />);
    
    const articleLinks = screen.getAllByRole('link');
    
    // Test Tab navigation through links
    articleLinks.forEach((link, index) => {
      fireEvent.focus(link);
      expect(link).toHaveFocus();
      
      // Test Enter key
      fireEvent.keyDown(link, { key: 'Enter' });
    });
  });

  it('should have proper ARIA attributes', () => {
    const mockPost = {
      url: '/current-article',
      frontmatter: {
        title: 'Current Article',
        category: 'test-category',
        tags: ['tag1', 'tag2']
      }
    };

    render(<RelatedArticles currentPost={mockPost} />);
    
    const section = screen.getByRole('region');
    expect(section).toBeInTheDocument();
    
    // Should not have redundant ARIA if semantic HTML is used
    const articleLinks = screen.getAllByRole('link');
    articleLinks.forEach(link => {
      expect(link).not.toHaveAttribute('aria-label'); // Should use visible text instead
    });
  });
});
