import { useEffect } from 'react';
import { useEvent } from './useEvent.ts';

export const useKeypress = (key: string, action: (e: KeyboardEvent) => void) => {
  const eventHandler = useEvent(action);

  useEffect(() => {
    function onKeyup(e: KeyboardEvent) {
      if (e.key === key) eventHandler(e);
    }
    window.addEventListener('keyup', onKeyup);
    return () => window.removeEventListener('keyup', onKeyup);
  }, []);
};
