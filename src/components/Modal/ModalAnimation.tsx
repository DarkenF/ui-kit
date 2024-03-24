import React, { useEffect, useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { ANIMATION_DURATION_TIME } from '../../constants/animation.ts';
import styles from './ModalAnimation.module.scss';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

const animation = {
  enter: styles.contentEnter,
  enterActive: styles.contentEnterActive,
  exit: styles.contentExit,
  exitActive: styles.contentExitActive,
};

export const ModalAnimation = (props: Props) => {
  const { isOpen, onClose, children } = props;

  const nodeRef = useRef<HTMLDivElement | null>(null);

  const [animationIn, setAnimationIn] = useState(false);

  useEffect(() => {
    setAnimationIn(isOpen);
  }, [isOpen]);

  return (
    <>
      <CSSTransition
        in={animationIn}
        nodeRef={nodeRef}
        timeout={ANIMATION_DURATION_TIME}
        mountOnEnter
        unmountOnExit
        classNames={animation}
      >
        <div ref={nodeRef}>
          <div role="button" className={styles.overlay} onClick={onClose}></div>
          <div className={styles.modal}>{children}</div>
        </div>
      </CSSTransition>
    </>
  );
};
