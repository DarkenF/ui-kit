import styles from './Popover.module.scss';
// eslint-disable-next-line import/named
import { Transition, TransitionStatus } from 'react-transition-group';
import { CSSProperties, FC, MouseEventHandler, useRef, useState } from 'react';
import * as React from 'react';
import { useOnClickOutside } from '../../hooks/useOnClickOutside.ts';
import { Portal } from '../Portal/Portal.tsx';

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

interface ChildrenProps {
  onClick: MouseEventHandler;
}

interface Props {
  content: React.ReactElement;
  children: React.ReactNode | ((props: ChildrenProps) => React.ReactNode);
}

interface Position {
  x: number;
  y: number;
}

export const Popover: FC<Props> = ({ content, children }) => {
  const [position, setPosition] = useState<Position | null>(null);

  const popperRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

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
      {typeof children === 'function' ? (
        children({
          onClick: onClick,
        })
      ) : (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
        <span ref={containerRef} className={styles.container} onClick={onClick}>
          {children}
        </span>
      )}
      <Transition
        nodeRef={popperRef}
        in={!!position}
        timeout={duration}
        mountOnEnter
        unmountOnExit
      >
        {(state) => (
          <>
            <Portal>
              <div
                ref={popperRef}
                style={{
                  ...defaultStyle,
                  ...transitionStyles[state],
                  top: `${position?.y}px`,
                  left: `${position?.x}px`,
                }}
                className={styles.popover}
              >
                {content}
              </div>
            </Portal>
          </>
        )}
      </Transition>
    </>
  );
};
