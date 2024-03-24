import styles from './Modal.module.scss';
import { Portal } from '../Portal/Portal.tsx';
import { ModalAnimation } from './ModalAnimation.tsx';
import { useIsMounted } from '../../hooks/useIsMount.ts';
import { useKeypress } from '../../hooks/useKeyPress.ts';
import React from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

export const Modal = (props: Props) => {
  const { isOpen, onClose, children } = props;

  const { isMounted } = useIsMounted(isOpen);

  useKeypress('Escape', () => {
    onClose();
  });

  if (!isMounted) {
    return null;
  }

  return (
    <Portal>
      <ModalAnimation isOpen={isOpen} onClose={onClose}>
        <div className={styles.modalHeader}>
          <h5 className={styles.heading}>Dialog</h5>
          <button className={styles.closeBtn} onClick={onClose}>
            X
          </button>
        </div>
        <div className={styles.modalContent}>{children}</div>
        <div className={styles.modalActions}>
          <div className={styles.actionsContainer}>
            <button className={styles.actionBtn} onClick={onClose}>
              Ok
            </button>
            <button className={styles.actionBtn} onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </ModalAnimation>
    </Portal>
  );
};
