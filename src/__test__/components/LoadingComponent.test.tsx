import React from 'react';
import { render, screen } from '@testing-library/react';
import { LoadingComponent } from '../../components/LoadingComponent';

describe('LoadingComponent', () => {
  test('renders loading spinner', () => {
    render(<LoadingComponent loadingText={null} />);
    
    const loaderElement = screen.getByTestId('loader');
    expect(loaderElement).toBeInTheDocument();
    expect(loaderElement).toHaveClass('loader');
  });

  test('renders loading text when provided', () => {
    const loadingText = 'Loading events...';
    render(<LoadingComponent loadingText={loadingText} />);
    
    expect(screen.getByText(loadingText)).toBeInTheDocument();
  });

  test('does not render loading text when null', () => {
    render(<LoadingComponent loadingText={null} />);
    
    const loadingTextElement = screen.queryByText(/loading/i);
    expect(loadingTextElement).not.toBeInTheDocument();
  });

  test('renders CircularProgress component', () => {
    render(<LoadingComponent loadingText="Loading..." />);
    
    // Check if CircularProgress is rendered by looking for the SVG element
    const progressElement = screen.getByRole('progressbar');
    expect(progressElement).toBeInTheDocument();
  });

  test('applies correct styling to loader', () => {
    render(<LoadingComponent loadingText="Loading..." />);
    
    const loaderElement = screen.getByTestId('loader');
    expect(loaderElement).toHaveClass('loader');
  });

  test('renders multiple loading texts correctly', () => {
    const loadingText1 = 'Loading appointments...';
    const loadingText2 = 'Loading teachers...';
    
    const { rerender } = render(<LoadingComponent loadingText={loadingText1} />);
    expect(screen.getByText(loadingText1)).toBeInTheDocument();
    
    rerender(<LoadingComponent loadingText={loadingText2} />);
    expect(screen.getByText(loadingText2)).toBeInTheDocument();
  });
}); 