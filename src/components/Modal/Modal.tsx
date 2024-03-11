import styles from './Modal.module.scss';
import { createPortal } from 'react-dom';
import { Transition, TransitionStatus } from 'react-transition-group';
import { CSSProperties, useRef } from 'react';
import { useKeypress } from '../../hooks/useKeyPress.ts';

interface Props {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const duration = 300;

const defaultStyle = {
  transition: `opacity ${duration}ms ease-in-out`,
  opacity: 0,
};

const transitionStyles = {
  entering: { opacity: 0.3 },
  entered: { opacity: 1 },
  exiting: { opacity: 0 },
  exited: { opacity: 0 },
} as Record<TransitionStatus, CSSProperties>;

export const Modal = (props: Props) => {
  const nodeRef = useRef();
  const { isOpen, setIsOpen } = props;

  useKeypress('Escape', () => setIsOpen(false));

  return (
    <Transition
      nodeRef={nodeRef}
      in={isOpen}
      timeout={duration}
      mountOnEnter
      unmountOnExit
    >
      {(state) => {
        return createPortal(
          <div
            style={{
              ...defaultStyle,
              ...transitionStyles[state],
            }}
          >
            <div className={styles.overlay} onClick={() => setIsOpen(false)}></div>
            <div className={styles.modal}>
              <div className={styles.modalHeader}>
                <h5 className={styles.heading}>Dialog</h5>
                <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
                  X
                </button>
              </div>
              <div className={styles.modalContent}>Modal content</div>
              <div className={styles.modalActions}>
                <div className={styles.actionsContainer}>
                  <button className={styles.actionBtn} onClick={() => setIsOpen(false)}>
                    Ok
                  </button>
                  <button className={styles.actionBtn} onClick={() => setIsOpen(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.getElementById('portal-container') as HTMLElement,
        );
      }}
    </Transition>
  );
};
