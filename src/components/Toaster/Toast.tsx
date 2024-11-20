import { CSSProperties, useEffect, useRef, useState } from 'react';
// eslint-disable-next-line import/named
import { Transition, TransitionStatus } from 'react-transition-group';
import styles from './Toaster.module.scss';
import { toaster, ToasterItem } from './Toaster.tsx';
import { ANIMATION_DURATION } from './constants.ts';

const TOASTER_HEIGHT = 50;
const TOASTER_GAP = 20;
const TOASTER_START_RIGHT_POSITION = 200;

const calculateToasterBottomPosition = (position: number) =>
  -(TOASTER_HEIGHT + TOASTER_GAP) * position;
const getDefaultStyles = () => {
  return {
    transition: `all ${ANIMATION_DURATION}ms ease-in-out`,
    position: 'absolute' as CSSProperties['position'],
    opacity: 0,
  };
};

const getTransitionStyles = (position: number) => {
  const translateY = calculateToasterBottomPosition(position);

  return {
    entering: {
      opacity: 0,
      transform: `translate(${TOASTER_START_RIGHT_POSITION}px, ${translateY}px)`,
    },
    entered: { opacity: 1, transform: `translate(0, ${translateY}px)` },
    exiting: {
      opacity: 0,
      transform: `translate(${TOASTER_START_RIGHT_POSITION}px, ${translateY}px)`,
    },
    exited: {
      opacity: 0,
      transform: `translate(${TOASTER_START_RIGHT_POSITION}px, ${translateY}px)`,
    },
  } as Record<TransitionStatus, CSSProperties>;
};
interface ToastProps {
  toast: ToasterItem;
  position: number;
}
export const Toast = ({ toast, position }: ToastProps) => {
  const [open, setOpen] = useState<boolean>(true);
  const popperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const timoutId = setTimeout(() => {
      setOpen(false);
    }, toast.timeout);

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
            ...getDefaultStyles(),
            ...getTransitionStyles(position)[state],
          }}
          className={styles.toaster}
        >
          {toast.message} {toast.id}
        </div>
      )}
    </Transition>
  );
};
