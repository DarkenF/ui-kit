import styles from './Popover.module.scss';
import { createPortal } from 'react-dom';
import { Transition, TransitionStatus } from 'react-transition-group';
import { CSSProperties, FC, useRef, useState } from 'react';
import * as React from 'react';
import { useOnClickOutside } from '../../hooks/useOnClickOutside.ts';

const duration = 300;

const defaultStyle = {
  transition: `all ${duration}ms ease-in-out`,
  opacity: 0,
};

const transitionStyles = {
  entering: { opacity: 0.3 },
  entered: { opacity: 1 },
  exiting: { opacity: 0 },
  exited: { opacity: 0 },
} as Record<TransitionStatus, CSSProperties>;

interface Props {
  content: React.ReactNode;
  children: React.ReactNode;
}

export const Popover: FC<Props> = ({ content, children }) => {
  const [showPopover, setShowPopover] = useState(false);

  const nodeRef = useRef();
  const positionRef = useRef<{ top: number; left: number }>({ top: 0, left: 0 });
  const popperRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const onClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    if (popperRef.current?.contains(e.target as HTMLElement)) {
      return;
    }

    const { offsetTop, offsetHeight, offsetLeft, offsetWidth } = e.currentTarget;

    positionRef.current = {
      top: offsetTop + offsetHeight,
      left: offsetLeft + offsetWidth,
    };

    setShowPopover((prev) => !prev);
  };

  useOnClickOutside(popperRef, (e: Event) => {
    if (containerRef.current?.contains(e.target as HTMLElement)) {
      return;
    }

    setShowPopover(false);
  });

  return (
    <span ref={containerRef} className={styles.container} onClick={onClick}>
      {children}
      <Transition
        nodeRef={nodeRef}
        in={showPopover}
        timeout={duration}
        mountOnEnter
        unmountOnExit
      >
        {(state) => (
          <>
            {showPopover &&
              createPortal(
                <div
                  ref={popperRef}
                  style={{
                    ...defaultStyle,
                    ...transitionStyles[state],
                    top: `${positionRef.current?.top}px`,
                    left: `${positionRef.current?.left}px`,
                  }}
                  className={styles.popover}
                >
                  {content}
                </div>,
                document.getElementById('portal-container') as HTMLElement,
              )}
          </>
        )}
      </Transition>
    </span>
  );
};
