import styles from './Drawer.module.scss';
import React from 'react';
import { DrawerAnimation } from './DrawerAnimation.tsx';
import { useClosePortalsListeners } from '../../context/portalsContext.tsx';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  position: 'right' | 'left';
}

export const Drawer = (props: Props) => {
  const { isOpen, onClose, children, position } = props;

  useClosePortalsListeners(onClose, isOpen);

  return (
    <DrawerAnimation position={position} isOpen={isOpen} onClose={onClose}>
      <div className={styles.drawerHeader}>
        <h5 className={styles.heading}>Drawer</h5>
        <button className={styles.closeBtn} onClick={onClose}>
          X
        </button>
      </div>
      <div className={styles.modalContent}>{children}</div>
    </DrawerAnimation>
  );
};
