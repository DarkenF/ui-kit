import styles from './Popover.module.scss';
import { Transition, TransitionStatus } from 'react-transition-group';
import { CSSProperties, FC, useRef, useState } from 'react';
import * as React from 'react';
import { useOnClickOutside } from '../../hooks/useOnClickOutside.ts';
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
  content: React.ReactElement;
  children: React.ReactNode;
}

interface Position {
  x: number;
  y: number;
}

export const Popover: FC<Props> = ({ content, children }) => {
  const [position, setPosition] = useState<Position | null>(null);

  const popperRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { isMounted } = useIsMounted(!!position);

  const onClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    const { offsetTop, offsetHeight, offsetLeft, offsetWidth } = e.currentTarget;

    if (position) {
      setPosition(null);

      return;
    }

    setPosition({
      y: offsetTop + offsetHeight,
      x: offsetLeft + offsetWidth,
    });
  };

  useOnClickOutside(popperRef, (e: Event) => {
    if (containerRef.current?.contains(e.target as HTMLElement)) {
      return;
    }

    setPosition(null);
  });

  return (
    <>
      <span ref={containerRef} className={styles.container} onClick={onClick}>
        {children}
      </span>
      <Transition
        nodeRef={popperRef}
        in={isMounted}
        timeout={duration}
        mountOnEnter
        unmountOnExit
      >
        {(state) => (
          <>
            <Portal>
              {React.cloneElement(content, {
                ref: popperRef,
                style: {
                  ...defaultStyle,
                  ...transitionStyles[state],
                  top: `${position?.y}px`,
                  left: `${position?.x}px`,
                },
                className: styles.popover,
              })}
            </Portal>
          </>
        )}
      </Transition>
    </>
  );
};
