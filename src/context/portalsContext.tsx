import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { useKeypress } from '../hooks/useKeyPress.ts';

type CloseFunction = () => void;
interface PortalsContextData {
  registerCloseHandler: (handler: CloseFunction) => void;
  unregisterCloseHandler: (handler: CloseFunction) => void;
}

const PortalsContext = createContext<PortalsContextData | null>(null);
export const PortalsListenersProvider = ({ children }: { children: React.ReactNode }) => {
  const portalsCloseHandlersList = useRef<CloseFunction[]>([]);

  const registerCloseHandler = useCallback((handler: CloseFunction) => {
    portalsCloseHandlersList.current.push(handler);
  }, []);

  const unregisterCloseHandler = useCallback((handler: CloseFunction) => {
    const handlerIndex = portalsCloseHandlersList.current.indexOf(handler);

    if (handlerIndex !== -1) {
      portalsCloseHandlersList.current.splice(handlerIndex, 1);
    }
  }, []);

  useKeypress('Escape', () => {
    if (!portalsCloseHandlersList.current.length) {
      return;
    }

    const closeHandler = portalsCloseHandlersList.current.pop();

    closeHandler?.();
  });

  const value = useMemo(
    () => ({
      registerCloseHandler,
      unregisterCloseHandler,
    }),
    [registerCloseHandler],
  );

  return <PortalsContext.Provider value={value}>{children}</PortalsContext.Provider>;
};

export const useClosePortalsListeners = (
  closeHandler: CloseFunction,
  isOpen: boolean,
) => {
  const context = useContext(PortalsContext);
  const initialCloseHandler = useRef(closeHandler);

  useEffect(() => {
    if (!isOpen) {
      context?.unregisterCloseHandler(initialCloseHandler.current);

      return;
    }

    context?.registerCloseHandler(initialCloseHandler.current);
  }, [isOpen]);

  return context;
};
