import { useEffect, useState } from 'react';
import { WindowDimensions } from '../types';

export const checkObjectKey = <T extends Record<string, any>>(
  obj: T, 
  fieldValue: any, 
  fieldName: string = 'fieldName'
): string[] => {
  return Object.keys(obj).filter(key => obj[key][fieldName] === fieldValue);
};

const getWindowDimensions = (): WindowDimensions => {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
};

export const useWindowDimensions = (): WindowDimensions => {
  const [windowDimensions, setWindowDimensions] = useState<WindowDimensions>(getWindowDimensions());

  useEffect(() => {
    function handleResize(): void {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}; 