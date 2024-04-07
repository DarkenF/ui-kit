import React, { useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import { ANIMATION_DURATION_TIME } from '../../constants/animation.ts';
import styles from './ModalAnimation.module.scss';
import { Portal } from '../Portal/Portal.tsx';

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

  return (
    <>
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
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/interactive-supports-focus */}
            <div role="button" className={styles.overlay} onClick={onClose}></div>
            <div className={styles.modal}>{children}</div>
          </div>
        </Portal>
      </CSSTransition>
    </>
  );
};
