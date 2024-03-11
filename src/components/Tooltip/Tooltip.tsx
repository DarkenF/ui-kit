import styles from './Tooltip.module.scss';
import { createPortal } from 'react-dom';
import { Transition, TransitionStatus } from 'react-transition-group';
import { CSSProperties, FC, useRef, useState } from 'react';
import * as React from 'react';

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
  text: string;
  children: React.ReactNode;
}

export const Tooltip: FC<Props> = ({ text, children }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const nodeRef = useRef();
  const positionRef = useRef<{ top: number; left: number }>({ top: 0, left: 0 });
  const onMouseEnterHandler = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    positionRef.current = {
      top: e.clientY,
      left: e.clientX,
    };
    setShowTooltip(true);
  };

  const onMouseLeaveHandler = () => {
    setShowTooltip(false);
  };

  return (
    <span
      className={styles.container}
      onMouseEnter={onMouseEnterHandler}
      onMouseLeave={onMouseLeaveHandler}
    >
      {children}
      <Transition
        nodeRef={nodeRef}
        in={showTooltip}
        timeout={duration}
        mountOnEnter
        unmountOnExit
      >
        {(state) => (
          <>
            {showTooltip &&
              createPortal(
                <div
                  style={{
                    ...defaultStyle,
                    ...transitionStyles[state],
                    top: `${positionRef.current.top}px`,
                    left: `${positionRef.current.left}px`,
                  }}
                  className={styles.tooltip}
                >
                  {text}
                </div>,
                document.getElementById('portal-container') as HTMLElement,
              )}
          </>
        )}
      </Transition>
    </span>
  );
};
