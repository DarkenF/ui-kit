import * as React from 'react';

import { useEffect, useState } from 'react';
import { debounce } from './useDebounce.ts';

export type ResizeOptions = {
  handleResize: boolean;
  debounce?: number;
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
    debounce: 500,
  },
}: PropsType) => {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });

  const placePopper = React.useCallback(() => {
    if (!triggerRef.current || !popperRef.current) return;

    const { current: triggerEl } = triggerRef;
    const { current: popEl } = popperRef;

    // TODO: Как сделать без getBoundingClientRect?
    const popperRect = popEl.getBoundingClientRect();

    const defaultPopperPosition = getDefaultPosition(
      triggerEl,
      popEl,
      direction,
      resizeOptions,
    );
    const calcLeft = (prev: Position) => {
      const rightOutsideDiff = window.innerWidth - (popperRect.left + popperRect.width);
      const leftOutsideDiff = popperRect.left;

      if (leftOutsideDiff > 0 && rightOutsideDiff > 0) {
        return defaultPopperPosition.x;
      }
      // За окном слева
      if (leftOutsideDiff < 0) {
        return popEl?.offsetLeft - leftOutsideDiff + Number(resizeOptions?.borderMargin);
      }

      // За окном справа
      if (rightOutsideDiff < 0) {
        return popEl?.offsetLeft + rightOutsideDiff - Number(resizeOptions?.borderMargin);
      }

      return prev.x;
    };

    const calcTop = (prev: Position) => {
      const bottomOutsideDiff = window.innerHeight - (popperRect.top + popperRect.height);
      const topOutsideDiff = popperRect.top;

      if (topOutsideDiff > 0 && bottomOutsideDiff > 0) {
        return defaultPopperPosition.y;
      }
      // За окном сверху
      if (topOutsideDiff < 0) {
        return popEl?.offsetTop - topOutsideDiff + Number(resizeOptions?.borderMargin);
      }

      // За окном справа
      if (bottomOutsideDiff < 0) {
        return popEl?.offsetTop + bottomOutsideDiff - Number(resizeOptions?.borderMargin);
      }

      return prev.y;
    };

    setPosition((prev) => ({
      ...prev,
      x: calcLeft(prev),
      y: calcTop(prev),
    }));
  }, [triggerRef, popperRef, direction]);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      placePopper();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
    };
  }, []);

  React.useEffect(() => {
    if (!resizeOptions.handleResize) return;

    const debouncedListener = debounce(placePopper, resizeOptions.debounce!);

    window.addEventListener('resize', debouncedListener);

    return () => {
      window.removeEventListener('resize', debouncedListener);
    };
  }, []);

  return position;
};
