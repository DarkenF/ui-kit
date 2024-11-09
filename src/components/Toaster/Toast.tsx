import { CSSProperties, useEffect, useRef, useState } from 'react';
// eslint-disable-next-line import/named
import { Transition, TransitionStatus } from 'react-transition-group';
import styles from './Toaster.module.scss';
import { toaster, ToasterItem } from './Toaster.tsx';
import { ANIMATION_DURATION, DEFAULT_TOASTER_TIMEOUT } from './constants.ts';

const TOASTER_HEIGHT = 50;
const TOASTER_GAP = 20;
const TOASTER_START_RIGHT_POSITION = -200;

const calculateToasterBottomPosition = (position: number) =>
  (TOASTER_HEIGHT + TOASTER_GAP) * position;
const getDefaultStyles = (position: number) => {
  return {
    transition: `all ${ANIMATION_DURATION}ms ease-in-out`,
    position: 'absolute' as CSSProperties['position'],
    opacity: 0,
    right: TOASTER_START_RIGHT_POSITION,
    bottom: `${calculateToasterBottomPosition(position)}px`,
  };
};

const getTransitionStyles = (position: number) => {
  const translateY = calculateToasterBottomPosition(position);

  return {
    entering: {
      opacity: 0,
      right: TOASTER_START_RIGHT_POSITION,
      bottom: `${translateY}px`,
    },
    entered: { opacity: 1, right: 0, bottom: `${translateY}px` },
    exiting: { opacity: 0, bottom: `${translateY}px` },
    exited: { opacity: 0, bottom: `${translateY}px` },
  } as Record<TransitionStatus, CSSProperties>;
};
interface ToastProps {
  toast: ToasterItem;
}
export const Toast = ({ toast }: ToastProps) => {
  const [open, setOpen] = useState<boolean>(true);
  const popperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const timoutId = setTimeout(() => {
      setOpen(false);
    }, DEFAULT_TOASTER_TIMEOUT);

    return () => {
      clearTimeout(timoutId);
    };
  }, []);

  const onToastExited = (id: number) => {
    toaster.removeToast(id);
  };

  return (
    <Transition
      key={toast.id}
      nodeRef={popperRef}
      in={open}
      appear
      onExited={() => onToastExited(toast.id)}
      timeout={ANIMATION_DURATION}
      mountOnEnter
      unmountOnExit
    >
      {(state) => (
        <div
          ref={popperRef}
          style={{
            ...getDefaultStyles(toast.position),
            ...getTransitionStyles(toast.position)[state],
          }}
          className={styles.toaster}
        >
          {toast.message} {toast.id}
        </div>
      )}
    </Transition>
  );
};
