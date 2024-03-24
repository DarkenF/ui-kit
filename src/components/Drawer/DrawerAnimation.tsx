import React, { useEffect, useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { ANIMATION_DURATION_TIME } from '../../constants/animation.ts';
import styles from './DrawerAnimation.module.scss';
import { clsx } from 'clsx';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  position: 'right' | 'left';
}

const getPositionStyles = (animationType: string, position: 'right' | 'left') => {
  switch (animationType) {
    case 'enter': {
      if (position === 'right') {
        return styles.contentEnterRight;
      } else {
        return styles.contentEnterLeft;
      }
    }
    case 'exitActive': {
      if (position === 'right') {
        return styles.contentExitActiveRight;
      } else {
        return styles.contentExitActiveLeft;
      }
    }
  }
};

export const DrawerAnimation = (props: Props) => {
  const { isOpen, onClose, children, position } = props;

  const overlayRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const [animationIn, setAnimationIn] = useState(false);

  useEffect(() => {
    setAnimationIn(isOpen);
  }, [isOpen]);

  const animation = {
    enter: getPositionStyles('enter', position),
    enterActive: styles.contentEnterActive,
    exit: styles.contentExit,
    exitActive: getPositionStyles('exitActive', position),
  };

  const overlayAnimation = {
    enter: styles.overlayEnter,
    enterActive: styles.overlayEnterActive,
    exit: styles.overlayExit,
    exitActive: styles.overlayExitActive,
  };

  return (
    <>
      <CSSTransition
        in={animationIn}
        nodeRef={overlayRef}
        timeout={ANIMATION_DURATION_TIME}
        mountOnEnter
        unmountOnExit
        classNames={overlayAnimation}
      >
        <div ref={overlayRef} className={styles.overlay} onClick={onClose}></div>
      </CSSTransition>
      <CSSTransition
        in={animationIn}
        nodeRef={contentRef}
        timeout={ANIMATION_DURATION_TIME}
        mountOnEnter
        unmountOnExit
        classNames={animation}
      >
        <div ref={contentRef} className={clsx(styles.drawer, styles[position])}>
          {children}
        </div>
      </CSSTransition>
    </>
  );
};
