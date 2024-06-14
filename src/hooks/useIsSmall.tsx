import { useEffect, useState } from 'react';
import { BreakPoint } from '@/types';
import useIsMobile from './useIsMobile';
import useBreakingPoints from './useBreakingPoints';

function useIsSmall() {
  const [isSmall, setIsSmall] = useState<boolean>(false);

  const breakTriggered = useBreakingPoints(BreakPoint.SM);
  const isMobile = useIsMobile();

  useEffect(() => {
    setIsSmall(breakTriggered || isMobile);
  }, [breakTriggered, isMobile]);

  return isSmall;
}

export default useIsSmall;
