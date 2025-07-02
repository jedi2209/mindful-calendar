import { renderHook, act } from '@testing-library/react';
import { checkObjectKey, useWindowDimensions } from '../../core/utils';

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

describe('checkObjectKey', () => {
  test('should return keys matching the field value', () => {
    const obj = {
      item1: { fieldName: 'test' },
      item2: { fieldName: 'other' },
      item3: { fieldName: 'test' },
    };

    const result = checkObjectKey(obj, 'test');
    expect(result).toEqual(['item1', 'item3']);
  });

  test('should return empty array when no matches found', () => {
    const obj = {
      item1: { fieldName: 'test' },
      item2: { fieldName: 'other' },
    };

    const result = checkObjectKey(obj, 'nonexistent');
    expect(result).toEqual([]);
  });

  test('should work with custom field name', () => {
    const obj = {
      item1: { customField: 'test' },
      item2: { customField: 'other' },
      item3: { customField: 'test' },
    };

    const result = checkObjectKey(obj, 'test', 'customField');
    expect(result).toEqual(['item1', 'item3']);
  });

  test('should handle empty object', () => {
    const obj = {};
    const result = checkObjectKey(obj, 'test');
    expect(result).toEqual([]);
  });

  test('should handle objects with missing field', () => {
    const obj = {
      item1: { fieldName: 'test' },
      item2: { differentField: 'other' },
      item3: { fieldName: 'test' },
    };

    const result = checkObjectKey(obj, 'test');
    expect(result).toEqual(['item1', 'item3']);
  });
});

describe('useWindowDimensions', () => {
  beforeEach(() => {
    mockWindowDimensions(1024, 768);
  });

  test('should return current window dimensions', () => {
    mockWindowDimensions(1200, 800);
    const { result } = renderHook(() => useWindowDimensions());
    
    expect(result.current.width).toBe(1200);
    expect(result.current.height).toBe(800);
  });

  test('should update dimensions when window is resized', () => {
    mockWindowDimensions(1024, 768);
    const { result } = renderHook(() => useWindowDimensions());
    
    expect(result.current.width).toBe(1024);
    expect(result.current.height).toBe(768);
    
    act(() => {
      triggerResize(800, 600);
    });
    
    expect(result.current.width).toBe(800);
    expect(result.current.height).toBe(600);
  });

  test('should handle multiple resize events', () => {
    const { result } = renderHook(() => useWindowDimensions());
    
    act(() => {
      triggerResize(1200, 800);
    });
    expect(result.current.width).toBe(1200);
    expect(result.current.height).toBe(800);
    
    act(() => {
      triggerResize(900, 600);
    });
    expect(result.current.width).toBe(900);
    expect(result.current.height).toBe(600);
    
    act(() => {
      triggerResize(1600, 1200);
    });
    expect(result.current.width).toBe(1600);
    expect(result.current.height).toBe(1200);
  });

  test('should cleanup event listener on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => useWindowDimensions());
    
    unmount();
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    removeEventListenerSpy.mockRestore();
  });
}); 