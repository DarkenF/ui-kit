import styles from './Drawer.module.scss';
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
  transition: `all ${duration}ms ease-in-out`,
  opacity: 0,
};

const transitionStyles = {
  entering: { opacity: 0.3, transform: 'translateX(400px)' },
  entered: { opacity: 1, transform: 'translateX(0px)' },
  exiting: { opacity: 0, transform: 'translateX(0px)' },
  exited: { opacity: 0, transform: 'translateX(400px)' },
} as Record<TransitionStatus, CSSProperties>;

export const Drawer = (props: Props) => {
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
          <div>
            <div className={styles.overlay} onClick={() => setIsOpen(false)}></div>
            <div
              style={{
                ...defaultStyle,
                ...transitionStyles[state],
              }}
              className={styles.drawer}
            >
              <div className={styles.drawerHeader}>
                <h5 className={styles.heading}>Drawer</h5>
                <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
                  X
                </button>
              </div>
              <div className={styles.modalContent}>Drawer content</div>
            </div>
          </div>,
          document.getElementById('portal-container') as HTMLElement,
        );
      }}
    </Transition>
  );
};
