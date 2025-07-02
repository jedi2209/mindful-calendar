import { useState, useEffect } from 'react';
import { useWindowDimensions } from '../core/utils';
import { SCHEDULER_CONFIG } from '../core/scheduler-constants';

export const useMobileDetection = () => {
  const { width } = useWindowDimensions();
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const mobile = width <= SCHEDULER_CONFIG.MOBILE_BREAKPOINT;
    if (mobile !== isMobile) {
      setIsMobile(mobile);
    }
  }, [width, isMobile]);

  return { isMobile };
}; 