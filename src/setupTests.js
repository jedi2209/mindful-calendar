// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Filter out known warnings from external libraries during tests
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  console.error = (...args) => {
    // Suppress defaultProps warnings from external libraries
    if (
      typeof args[0] === 'string' && 
      args[0].includes('Support for defaultProps will be removed from function components')
    ) {
      return;
    }
    
    // Suppress defaultProps warnings from memo components
    if (
      typeof args[0] === 'string' && 
      args[0].includes('Support for defaultProps will be removed from memo components')
    ) {
      return;
    }
    
    // Suppress ReactDOMTestUtils.act deprecation warnings
    if (
      typeof args[0] === 'string' && 
      args[0].includes('ReactDOMTestUtils.act` is deprecated in favor of `React.act')
    ) {
      return;
    }
    
    // Suppress act warnings in tests (these are expected in test environment)
    if (
      typeof args[0] === 'string' && 
      args[0].includes('An update to') && 
      args[0].includes('inside a test was not wrapped in act')
    ) {
      return;
    }
    
    // Allow all other console.error messages
    originalError.call(console, ...args);
  };

  console.warn = (...args) => {
    // Suppress defaultProps warnings 
    if (
      typeof args[0] === 'string' && 
      args[0].includes('defaultProps')
    ) {
      return;
    }
    
    // Allow all other console.warn messages
    originalWarn.call(console, ...args);
  };
});

afterAll(() => {
  // Restore original console methods
  console.error = originalError;
  console.warn = originalWarn;
});
