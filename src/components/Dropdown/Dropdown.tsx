import styles from './Dropdown.module.scss';
import { Transition, TransitionStatus } from 'react-transition-group';
import {
  Children,
  cloneElement,
  CSSProperties,
  MutableRefObject,
  useRef,
  useState,
} from 'react';
import * as React from 'react';
import { useOnClickOutside } from '../../hooks/useOnClickOutside.ts';
import { Portal } from '../Portal/Portal.tsx';
import { Loader } from '../Loader/Loader.tsx';
import { useResizeObserver } from '../../hooks/useResizeObserver.tsx';

const duration = 300;

const defaultStyle = {
  transition: `all ${duration}ms ease-in-out`,
  opacity: 0,
};

const transitionStyles = {
  entering: { opacity: 0 },
  entered: { opacity: 1 },
  exiting: { opacity: 0 },
  exited: { opacity: 0 },
} as Record<TransitionStatus, CSSProperties>;

interface DropdownExtensions {
  Item: typeof DropdownItem;
}

interface Props {
  children: React.ReactElement<DropdownItemProps>[];
  isOpen: boolean;
  isLoading?: boolean;
  onClose: () => void;
  anchorElementRef: MutableRefObject<HTMLElement | null>;
}

interface Position {
  x: number;
  y: number;
}

export const Dropdown: React.FC<Props> & DropdownExtensions = ({
  children,
  anchorElementRef,
  onClose,
  isLoading,
  isOpen,
}: Props) => {
  const nodeRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });

  useResizeObserver(anchorElementRef, ([entry]) => {
    const element = entry.target as HTMLElement;
    setPosition({
      y: element.offsetTop + element.offsetHeight,
      x: element.offsetLeft,
    });
  });

  useOnClickOutside(nodeRef, (e: Event) => {
    if (anchorElementRef?.current?.contains(e.target as HTMLElement)) {
      return;
    }

    onClose();
  });

  return (
    <Transition
      nodeRef={nodeRef}
      in={isOpen}
      timeout={duration}
      mountOnEnter
      unmountOnExit
    >
      {(state) => (
        <>
          <Portal>
            <div
              ref={nodeRef}
              style={{
                ...defaultStyle,
                ...transitionStyles[state],
                top: `${position?.y}px`,
                left: `${position?.x}px`,
              }}
              className={styles.dropdown}
            >
              {isLoading ? (
                <Loader />
              ) : (
                Children.map(children, (child) =>
                  cloneElement(child, {
                    ...child?.props,
                    onClick: () => {
                      child.props.onClick?.();
                      onClose();
                    },
                  }),
                )
              )}
            </div>
          </Portal>
        </>
      )}
    </Transition>
  );
};

Dropdown.Item = DropdownItem;

interface DropdownItemProps {
  children: React.ReactNode;
  onClick?: () => void;
}

function DropdownItem(props: DropdownItemProps) {
  const { children, onClick } = props;

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions,jsx-a11y/click-events-have-key-events
    <div className={styles.dropdownItem} onClick={onClick}>
      {children}
    </div>
  );
}
