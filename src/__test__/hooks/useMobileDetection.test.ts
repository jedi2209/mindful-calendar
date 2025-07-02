import { renderHook, act } from '@testing-library/react';
import { useMobileDetection } from '../../hooks/useMobileDetection';

// Mock window dimensions
const mockWindowDimensions = (width: number, height: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  });
};

// Mock resize event
const triggerResize = (width: number, height: number) => {
  mockWindowDimensions(width, height);
  window.dispatchEvent(new Event('resize'));
};

describe('useMobileDetection', () => {
  beforeEach(() => {
    // Reset to desktop size
    mockWindowDimensions(1024, 768);
  });

  test('should return false for desktop screen sizes', () => {
    mockWindowDimensions(1024, 768);
    const { result } = renderHook(() => useMobileDetection());
    
    expect(result.current.isMobile).toBe(false);
  });

  test('should return true for mobile screen sizes', () => {
    mockWindowDimensions(375, 667); // iPhone size
    const { result } = renderHook(() => useMobileDetection());
    
    expect(result.current.isMobile).toBe(true);
  });

  test('should return true for tablet screen sizes below breakpoint', () => {
    mockWindowDimensions(768, 1024); // iPad portrait
    const { result } = renderHook(() => useMobileDetection());
    
    expect(result.current.isMobile).toBe(true);
  });

  test('should update isMobile when window is resized', () => {
    mockWindowDimensions(1024, 768);
    const { result } = renderHook(() => useMobileDetection());
    
    // Initially desktop
    expect(result.current.isMobile).toBe(false);
    
    // Resize to mobile
    act(() => {
      triggerResize(375, 667);
    });
    
    expect(result.current.isMobile).toBe(true);
    
    // Resize back to desktop
    act(() => {
      triggerResize(1200, 800);
    });
    
    expect(result.current.isMobile).toBe(false);
  });
}); 