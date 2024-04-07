import React, { useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import { ANIMATION_DURATION_TIME } from '../../constants/animation.ts';
import styles from './DrawerAnimation.module.scss';
import { clsx } from 'clsx';
import { Portal } from '../Portal/Portal.tsx';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  position: 'right' | 'left';
}

export const DrawerAnimation = (props: Props) => {
  const { isOpen, onClose, children, position } = props;

  const nodeRef = useRef<HTMLDivElement | null>(null);

  const animation = {
    enter: styles.enter,
    enterActive: styles.enterActive,
    exit: styles.exit,
    exitActive: styles.exitActive,
  };

  return (
    <CSSTransition
      in={isOpen}
      nodeRef={nodeRef}
      timeout={ANIMATION_DURATION_TIME}
      mountOnEnter
      unmountOnExit
      classNames={animation}
    >
      <Portal>
        <div ref={nodeRef}>
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
          <div className={styles.overlay} onClick={onClose}></div>
          <div className={clsx(styles.drawer, styles[position])}>{children}</div>
        </div>
      </Portal>
    </CSSTransition>
  );
};
