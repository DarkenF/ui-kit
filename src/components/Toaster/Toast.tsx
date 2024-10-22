import { CSSProperties, useEffect, useRef, useState } from 'react';
// eslint-disable-next-line import/named
import { Transition, TransitionStatus } from 'react-transition-group';
import styles from './Toaster.module.scss';
import { ToasterClass, ToasterItem } from './Toaster.tsx';

const ANIMATION_DURATION = 200;

const DEFAULT_TOASTER_TIMEOUT = 3_000;

const defaultStyle = {
  transition: `all ${ANIMATION_DURATION}ms ease-in-out`,
  opacity: 0,
};

const transitionStyles = {
  entering: { opacity: 0 },
  entered: { opacity: 1 },
  exiting: { opacity: 0 },
  exited: { opacity: 0 },
} as Record<TransitionStatus, CSSProperties>;

interface ToastProps {
  toast: ToasterItem;
}
export const Toast = ({ toast }: ToastProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const popperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setOpen(true);
  }, []);
  const onToasterEntered = () => {
    setTimeout(() => {
      setOpen(false);
    }, DEFAULT_TOASTER_TIMEOUT);
  };

  const onToastExited = (id: number) => {
    ToasterClass.removeToast(id);
  };

  return (
    <Transition
      key={toast.id}
      nodeRef={popperRef}
      in={open}
      onExited={() => onToastExited(toast.id)}
      onEntered={onToasterEntered}
      timeout={ANIMATION_DURATION}
      mountOnEnter
      unmountOnExit
    >
      {(state) => (
        <div
          ref={popperRef}
          style={{
            ...defaultStyle,
            ...transitionStyles[state],
          }}
          className={styles.toaster}
        >
          {toast.message}
        </div>
      )}
    </Transition>
  );
};
