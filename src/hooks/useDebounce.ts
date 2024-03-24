import { useEvent } from './useEvent.ts';
import { useEffect, useMemo } from 'react';

export const debounce = <T extends (...args: any[]) => any>(fn: T, ms: number) => {
  let timeoutId: number | null = null;

  function debounced(...args: Parameters<T>) {
    if (typeof timeoutId === 'number') {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      timeoutId = null;
      fn.call(null, ...args);
    }, ms);
  }

  debounced.cancel = () => {
    if (typeof timeoutId !== 'number') {
      return;
    }
    clearTimeout(timeoutId);
  };

  return debounced;
};

export const useDebounce = <Fn extends (...args: any[]) => any>(fn: Fn, ms: number) => {
  const memoizedFn = useEvent(fn);

  const debouncedFn = useMemo(
    () =>
      debounce((...args: Parameters<Fn>) => {
        memoizedFn(...args);
      }, ms),
    [ms],
  );

  useEffect(
    () => () => {
      debouncedFn.cancel();
    },
    [debouncedFn],
  );

  return debouncedFn;
};
