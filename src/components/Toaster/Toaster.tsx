import styles from './Toaster.module.scss';
import { useEffect, useState } from 'react';
import { Portal } from '../Portal/Portal.tsx';
import { Toast } from './Toast.tsx';
import { ANIMATION_DURATION, DEFAULT_TOASTER_TIMEOUT } from './constants.ts';
export interface ToasterItem {
  id: number;
  message: string;
  timeout: number;
  type: 'success' | 'error' | 'info';
}

type ToastListener = (toasts: ToasterItem[]) => void;

export class ToasterClass {
  private static instance: ToasterClass;
  private toasts: ToasterItem[] = [];
  private subscribers: ToastListener[] = [];

  private constructor() {}
  static getInstance() {
    if (!ToasterClass.instance) {
      ToasterClass.instance = new ToasterClass();
    }
    return ToasterClass.instance;
  }
  subscribe(listener: ToastListener) {
    this.subscribers.push(listener);
    listener(this.toasts);
  }

  unsubscribe(listener: ToastListener) {
    this.subscribers = this.subscribers.filter((l) => l !== listener);
  }

  private notifyListeners() {
    this.subscribers.forEach((listener) => listener(this.toasts));
  }

  addToast(
    message: string,
    type: ToasterItem['type'] = 'info',
    duration: number = DEFAULT_TOASTER_TIMEOUT,
  ) {
    const id = Date.now();
    const newToast: ToasterItem = { id, message, type, timeout: duration };

    this.toasts = [newToast, ...this.toasts];

    this.notifyListeners();

    setTimeout(() => this.removeToast(id), duration + ANIMATION_DURATION);
  }

  removeToast(id: number) {
    this.toasts = this.toasts.filter((toast) => toast.id !== id);

    this.notifyListeners();
  }
}
export const toaster = ToasterClass.getInstance();
export const Toaster = () => {
  const [toasters, setToasters] = useState<ToasterItem[]>([]);

  useEffect(() => {
    const handleToastsChange = (updatedToasts: ToasterItem[]) =>
      setToasters(updatedToasts);

    toaster.subscribe(handleToastsChange);
    return () => {
      toaster.unsubscribe(handleToastsChange);
    };
  }, []);

  return (
    <Portal>
      <div className={styles.toasterContainer}>
        {toasters.map((toast, index) => (
          <Toast key={toast.id} toast={toast} position={index}></Toast>
        ))}
      </div>
    </Portal>
  );
};
