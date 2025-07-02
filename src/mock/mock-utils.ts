/**
 * Utility functions for managing mock mode and API testing
 */

/**
 * Check if the application is running in mock mode
 * @returns true if mock mode is enabled
 */
export const isMockMode = (): boolean => {
  return process.env.REACT_APP_USE_MOCK_DATA === 'true' || 
         process.env.NODE_ENV === 'development';
};

/**
 * Enable mock mode programmatically (for testing purposes)
 */
export const enableMockMode = (): void => {
  (window as any).__MOCK_MODE__ = true;
  console.info('🔧 Mock mode enabled programmatically');
};

/**
 * Disable mock mode programmatically (for testing purposes)
 */
export const disableMockMode = (): void => {
  (window as any).__MOCK_MODE__ = false;
  console.info('🌐 Mock mode disabled - using real API');
};

/**
 * Check if mock mode is enabled programmatically
 */
export const isProgrammaticMockMode = (): boolean => {
  return (window as any).__MOCK_MODE__ === true;
};

/**
 * Get current API mode status
 */
export const getApiModeStatus = (): string => {
  if (isMockMode() || isProgrammaticMockMode()) {
    return 'MOCK';
  }
  return 'LIVE';
};

/**
 * Development helper: Toggle mock mode in browser console
 * Usage in console: window.toggleMockMode()
 */
if (process.env.NODE_ENV === 'development') {
  (window as any).toggleMockMode = () => {
    const currentMode = isProgrammaticMockMode();
    if (currentMode) {
      disableMockMode();
    } else {
      enableMockMode();
    }
    console.info(`Mock mode is now: ${getApiModeStatus()}`);
    console.info('Refresh the page to apply changes');
  };

  (window as any).getMockStatus = () => {
    console.info(`Current API mode: ${getApiModeStatus()}`);
    console.info('Environment variables:');
    console.info(`  REACT_APP_USE_MOCK_DATA: ${process.env.REACT_APP_USE_MOCK_DATA}`);
    console.info(`  NODE_ENV: ${process.env.NODE_ENV}`);
    console.info('Programmatic override:', isProgrammaticMockMode());
  };

  console.info(`
🔧 Mock Mode Utilities Available:
  - window.toggleMockMode() - Toggle between mock and live API
  - window.getMockStatus() - Check current API mode status
  - Current mode: ${getApiModeStatus()}
  `);
} 