import styles from './Drawer.module.scss';
import React from 'react';
import { Portal } from '../Portal/Portal.tsx';
import { useIsMounted } from '../../hooks/useIsMount.ts';
import { DrawerAnimation } from './DrawerAnimation.tsx';
import { useKeypress } from '../../hooks/useKeyPress.ts';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  position: 'right' | 'left';
}

export const Drawer = (props: Props) => {
  const { isOpen, onClose, children, position } = props;

  const { isMounted } = useIsMounted(isOpen);

  useKeypress('Escape', () => {
    onClose();
  });

  if (!isMounted) {
    return null;
  }

  return (
    <Portal>
      <DrawerAnimation position={position} isOpen={isOpen} onClose={onClose}>
        <div className={styles.drawerHeader}>
          <h5 className={styles.heading}>Drawer</h5>
          <button className={styles.closeBtn} onClick={onClose}>
            X
          </button>
        </div>
        <div className={styles.modalContent}>{children}</div>
      </DrawerAnimation>
    </Portal>
  );
};
