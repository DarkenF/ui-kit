import * as React from 'react';

import { useEffect, useState } from 'react';
import { useRafThrottle } from './useRafThrottle.ts';

export type ResizeOptions = {
  handleResize: boolean;
  borderMargin?: number;
  popperMargin?: number;
};

export type Direction = 'top' | 'bottom' | 'left' | 'right';

export interface PropsType {
  triggerRef: React.RefObject<HTMLElement>;
  popperRef: React.RefObject<HTMLElement>;
  direction?: Direction;
  resizeOptions?: ResizeOptions;
}

interface Position {
  x: number;
  y: number;
}
const getDefaultPosition = (
  triggerElement: HTMLElement | null,
  popperElement: HTMLElement | null,
  direction: Direction,
  resizeOptions: ResizeOptions,
) => {
  if (!triggerElement || !popperElement) {
    return { x: 0, y: 0 };
  }

  const horizontalCenterTriggerPosition =
    triggerElement.offsetLeft + triggerElement.offsetWidth / 2;
  const verticalCenterTriggerPosition =
    triggerElement.offsetTop + triggerElement.offsetHeight / 2;

  switch (direction) {
    case 'top': {
      return {
        y:
          triggerElement.offsetTop -
          popperElement.offsetHeight -
          Number(resizeOptions?.popperMargin),
        x: horizontalCenterTriggerPosition - popperElement.offsetWidth / 2,
      };
    }
    case 'bottom': {
      return {
        y:
          triggerElement.offsetTop +
          triggerElement.offsetHeight +
          Number(resizeOptions?.popperMargin),
        x: horizontalCenterTriggerPosition - popperElement.offsetWidth / 2,
      };
    }
    case 'right': {
      return {
        y: verticalCenterTriggerPosition - popperElement.offsetHeight / 2,
        x:
          triggerElement.offsetLeft +
          triggerElement.offsetWidth +
          Number(resizeOptions?.popperMargin),
      };
    }
    case 'left': {
      return {
        y: verticalCenterTriggerPosition - popperElement.offsetHeight / 2,
        x:
          triggerElement.offsetLeft -
          popperElement.offsetWidth -
          Number(resizeOptions?.popperMargin),
      };
    }
    default:
      return { x: 0, y: 0 };
  }
};

export const usePopperPlacement = ({
  triggerRef,
  popperRef,
  direction = 'bottom',
  resizeOptions = {
    handleResize: true,
    borderMargin: 14,
    popperMargin: 4,
  },
}: PropsType) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });

  const placePopper = React.useCallback(() => {
    if (!triggerRef.current || !popperRef.current) return;

    const { current: triggerEl } = triggerRef;
    const { current: popEl } = popperRef;

    const defaultPopperPosition = getDefaultPosition(
      triggerEl,
      popEl,
      direction,
      resizeOptions,
    );

    // Посчитано только для direction = 'bottom',
    const totalOffsetRight =
      triggerEl?.offsetLeft +
      triggerEl?.offsetWidth / 2 +
      popEl?.offsetWidth / 2 +
      Number(resizeOptions?.borderMargin);
    const totalOffsetLeft =
      triggerEl?.offsetLeft -
      (popEl?.offsetWidth / 2 - triggerEl?.offsetWidth / 2) -
      Number(resizeOptions?.borderMargin);
    const totalOffsetTop =
      triggerEl?.offsetTop +
      triggerEl?.offsetHeight +
      Number(resizeOptions?.borderMargin) +
      Number(resizeOptions?.popperMargin);
    const totalOffsetBottom =
      triggerEl?.offsetTop +
      triggerEl?.offsetHeight +
      popEl?.offsetHeight +
      Number(resizeOptions?.borderMargin) +
      Number(resizeOptions?.popperMargin);

    const scrollBarWidth = window.innerWidth - document.body.clientWidth;

    const rightOutsideDiff =
      window.innerWidth - scrollBarWidth + window.scrollX - totalOffsetRight;
    const leftOutsideDiff = totalOffsetLeft - window.scrollX;
    const topOutsideDiff = totalOffsetTop - window.scrollY;
    const bottomOutsideDiff =
      window.innerHeight - scrollBarWidth + window.scrollY - totalOffsetBottom;

    const calcLeft =
      rightOutsideDiff < 0
        ? defaultPopperPosition.x + rightOutsideDiff
        : leftOutsideDiff < 0
          ? defaultPopperPosition.x - leftOutsideDiff
          : defaultPopperPosition.x;
    const calcTop =
      topOutsideDiff < 0
        ? defaultPopperPosition.y - topOutsideDiff
        : bottomOutsideDiff < 0
          ? defaultPopperPosition.y + bottomOutsideDiff
          : defaultPopperPosition.y;

    // Ограничение по координатам
    const minLeft = triggerEl?.offsetLeft + triggerEl?.offsetWidth - popEl?.offsetWidth;
    const maxLeft = triggerEl?.offsetLeft;
    const minTop =
      triggerEl?.offsetTop - popEl?.offsetHeight - Number(resizeOptions?.popperMargin);
    const maxTop =
      triggerEl?.offsetTop +
      triggerEl?.offsetHeight +
      Number(resizeOptions?.popperMargin);

    setPosition((prev) => ({
      ...prev,
      x: calcLeft < minLeft ? minLeft : calcLeft > maxLeft ? maxLeft : calcLeft,
      y: calcTop < minTop ? minTop : calcTop > maxTop ? maxTop : calcTop,
    }));
  }, [triggerRef, popperRef, direction]);

  const throttledPopperPlace = useRafThrottle(placePopper);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      if (popperRef.current) {
        placePopper();
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
    };
  }, []);

  React.useEffect(() => {
    if (resizeOptions.handleResize && isOpen) {
      window.addEventListener('resize', throttledPopperPlace);
      window.addEventListener('scroll', throttledPopperPlace);
    }

    return () => {
      window.removeEventListener('resize', throttledPopperPlace);
      window.removeEventListener('scroll', throttledPopperPlace);
    };
  }, [isOpen]);

  return position;
};
