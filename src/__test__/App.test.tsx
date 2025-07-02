import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from '../App';
import { enableMockMode, disableMockMode } from '../mock/mock-utils';

// Mock console.info to avoid noise in tests
const originalConsoleInfo = console.info;

beforeAll(() => {
  console.info = jest.fn();
});

afterAll(() => {
  console.info = originalConsoleInfo;
});

describe('App Component', () => {
  beforeEach(() => {
    // Enable mock mode for tests
    enableMockMode();
  });

  afterEach(() => {
    // Clean up
    disableMockMode();
  });

  test('renders loader when events are not loaded initially', async () => {
    render(<App />);
    
    // Initially, the loader should be visible while data is loading
    const loaderElement = screen.getByTestId('loader');
    expect(loaderElement).toBeInTheDocument();
  });

  test('renders scheduler when events are loaded', async () => {
    render(<App />);

    // Wait for the scheduler to appear after data loading
    await waitFor(
      () => {
        const schedulerElement = screen.getByTestId('scheduler-component');
        expect(schedulerElement).toBeInTheDocument();
      },
      { timeout: 5000 } // Increased timeout to account for simulated network delay
    );

    // Verify loader is no longer present
    expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
  });

  test('displays loading text during data fetch', async () => {
    render(<App />);

    // Check that loading text appears
    const loadingTextElements = screen.getAllByText(/loading/i);
    expect(loadingTextElements.length).toBeGreaterThan(0);
  });
}); 