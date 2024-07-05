import { BREAKPOINTS } from '@/constants/breakpoints';
import { useEffect, useState } from 'react';

interface WindowSize {
  width: number;
  height: number;
  isSmall: boolean;
}

function getWindowSize(): WindowSize {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
    isSmall: width < BREAKPOINTS.md,
  };
}

function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>(getWindowSize());

  useEffect(() => {
    const handleResize = () => {
      setWindowSize(getWindowSize());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

export default useWindowSize;
