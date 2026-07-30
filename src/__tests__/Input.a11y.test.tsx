import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Input } from '@/components/ui/input';

describe('Input Accessibility', () => {
  it('should not have accessibility violations', async () => {
    const { container } = render(
      <div>
        <Input placeholder="Default input" />
        <Input type="email" placeholder="Email input" />
        <Input type="password" placeholder="Password input" />
        <Input disabled placeholder="Disabled input" />
        <Input defaultValue="Default value" />
        <Input placeholder="Search input" />
      </div>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper input semantics', () => {
    render(<Input placeholder="Test input" />);
    
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'text');
  });

  it('should have visible focus indicator', () => {
    render(<Input placeholder="Test input" />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('focus-visible:ring-2');
    expect(input).toHaveClass('focus-visible:ring-blue-500');
    expect(input).toHaveClass('focus-visible:ring-offset-2');
  });

  it('should handle different input types correctly', () => {
    render(<Input type="email" placeholder="Email input" />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('type', 'email');
  });

  it('should handle disabled state correctly', () => {
    render(<Input disabled placeholder="Disabled input" />);
    
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
    expect(input).toHaveAttribute('aria-disabled', 'true');
  });

  it('should have proper placeholder text', () => {
    render(<Input placeholder="Test placeholder" />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('placeholder', 'Test placeholder');
  });

  it('should have proper color contrast', async () => {
    const { container } = render(
      <div>
        <Input placeholder="Default input" />
        <Input type="email" placeholder="Email input" />
        <Input type="password" placeholder="Password input" />
      </div>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should handle file input correctly', () => {
    render(<Input type="file" />);
    
    const input = screen.getByRole('button');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'file');
  });

  it('should have proper sizing for touch targets', () => {
    render(<Input placeholder="Test input" />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('h-10'); // 40px height meets WCAG 24x24px
  });
});
