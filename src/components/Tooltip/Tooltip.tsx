import styles from './Tooltip.module.scss';
import { Transition, TransitionStatus } from 'react-transition-group';
import { CSSProperties, FC, useRef, useState } from 'react';
import * as React from 'react';
import { Portal } from '../Portal/Portal.tsx';
import { useIsMounted } from '../../hooks/useIsMount.ts';

const duration = 300;

const defaultStyle = {
  transition: `all ${duration}ms ease-in-out`,
  opacity: 0,
};

const transitionStyles = {
  entering: { opacity: 0 },
  entered: { opacity: 1 },
  exiting: { opacity: 0 },
  exited: { opacity: 0 },
} as Record<TransitionStatus, CSSProperties>;

interface Props {
  text: string;
  children: React.ReactNode;
}

interface Position {
  x: number;
  y: number;
}

const USER_EVENT_TIMEOUT = 75;

export const Tooltip: FC<Props> = ({ text, children }) => {
  const [position, setPosition] = useState<Position | null>(null);

  const containerRef = useRef<HTMLSpanElement | null>(null);
  const timeoutRef = useRef<number>();
  const nodeRef = useRef<HTMLDivElement | null>(null);

  const { isMounted } = useIsMounted(!!position);

  const onMouseEnterHandler = () => {
    const { offsetTop, offsetHeight, offsetLeft, offsetWidth } = containerRef.current!;

    timeoutRef.current = setTimeout(() => {
      setPosition({
        y: offsetTop + offsetHeight,
        x: offsetLeft + offsetWidth,
      });
    }, USER_EVENT_TIMEOUT);
  };

  const onMouseLeaveHandler = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setPosition(null);
  };

  return (
    <span
      ref={containerRef}
      className={styles.container}
      onMouseEnter={onMouseEnterHandler}
      onMouseLeave={onMouseLeaveHandler}
    >
      {children}
      <Transition
        nodeRef={nodeRef}
        in={isMounted}
        timeout={duration}
        mountOnEnter
        unmountOnExit
      >
        {(state) => (
          <>
            <Portal>
              <div
                ref={nodeRef}
                style={{
                  ...defaultStyle,
                  ...transitionStyles[state],
                  top: `${position?.y}px`,
                  left: `${position?.x}px`,
                }}
                className={styles.tooltip}
              >
                {text}
              </div>
            </Portal>
          </>
        )}
      </Transition>
    </span>
  );
};
