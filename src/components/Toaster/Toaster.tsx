import styles from './Toaster.module.scss';
// eslint-disable-next-line import/named
import React, { useEffect, useState } from 'react';
import { Portal } from '../Portal/Portal.tsx';
import { Toast } from './Toast.tsx';
export interface ToasterItem {
  id: number;
  position: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

export class ToasterClass {
  static toastUpdater: undefined | React.Dispatch<React.SetStateAction<ToasterItem[]>>;

  addToast = (message: string, type: ToasterItem['type'] = 'info') => {
    const id = Date.now();
    if (ToasterClass.toastUpdater) {
      ToasterClass.toastUpdater((prev) => {
        const nextToaster = {
          message,
          type,
          position: 0,
          id,
        };
        const updatedPrevToasters = prev.map((item, index) => ({
          ...item,
          position: index + 1,
        }));

        return [nextToaster, ...updatedPrevToasters];
      });
    }
  };

  static removeToast = (id: number) => {
    if (this.toastUpdater) {
      this.toastUpdater((prev) => prev.filter((toast) => toast.id !== id));
    }
  };

  static registerToaster = (
    setToasts: React.Dispatch<React.SetStateAction<ToasterItem[]>> | undefined,
  ) => {
    this.toastUpdater = setToasts;
  };
}

export const toaster = new ToasterClass();
export const Toaster = () => {
  const [toasters, setToasters] = useState<ToasterItem[]>([]);

  useEffect(() => {
    ToasterClass.registerToaster(setToasters);

    return () => {
      ToasterClass.registerToaster(undefined);
    };
  }, [setToasters]);

  return (
    <Portal>
      <div className={styles.toasterContainer}>
        {toasters.map((toast) => (
          <Toast key={toast.id} toast={toast}></Toast>
        ))}
      </div>
    </Portal>
  );
};
