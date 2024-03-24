import { useEffect, useRef } from 'react';

export const useKeypress = (key: string, action: (e: KeyboardEvent) => void) => {
  const eventHandler = useRef(action);

  useEffect(() => {
    function onKeyup(e: KeyboardEvent) {
      if (e.key === key) eventHandler.current(e);
    }
    window.addEventListener('keyup', onKeyup);
    return () => window.removeEventListener('keyup', onKeyup);
  }, []);
};
