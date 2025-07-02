import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App Component', () => {
  test('renders loader when events are not loaded', () => {
    render(<App />);
    const loaderElement = screen.getByTestId('loader');
    expect(loaderElement).toBeInTheDocument();
  });

  test('renders scheduler when events are loaded', async () => {
    render(<App />);
    setTimeout(async () => {
      await screen.findByTestId('scheduler-component');
      const schedulerElement = screen.getByTestId('scheduler-component');
      expect(schedulerElement).toBeInTheDocument();
    }, 10 * 1000);
  });
}); 