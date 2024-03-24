import { useEffect, useState } from 'react';
import { ANIMATION_DURATION_TIME } from '../constants/animation.ts';

export const useIsMounted = (open: boolean) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    if (open && !isMounted) {
      setIsMounted(true);

      return;
    }

    if (!open && isMounted) {
      setTimeout(() => {
        setIsMounted(false);
      }, ANIMATION_DURATION_TIME);
    }
  }, [open]);

  return {
    isMounted,
  };
};
