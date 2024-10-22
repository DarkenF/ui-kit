import * as React from 'react';
import { Children, cloneElement, useState } from 'react';

import styles from './Collapse.module.scss';
import { clsx } from 'clsx';

interface Props {
  isSingle?: boolean;
  children:
    | React.ReactElement<CollapseItemProps>[]
    | React.ReactElement<CollapseItemProps>;
}
export const Collapse = (props: Props) => {
  const { children, isSingle } = props;

  const [openedIndexes, setOpenedIndexes] = useState<number[]>([]);

  const onToggleItem = (index: number) => {
    const openedCollapseItemIndex = openedIndexes.indexOf(index);

    if (openedCollapseItemIndex !== -1) {
      const nextOpenIndexesState = [...openedIndexes];
      nextOpenIndexesState.splice(openedCollapseItemIndex, 1);
      setOpenedIndexes(nextOpenIndexesState);
    } else {
      if (isSingle) {
        setOpenedIndexes([index]);
        return;
      }
      setOpenedIndexes((prev) => [...prev, index]);
    }
  };

  return (
    <div>
      {Children.map(children, (child, index) => {
        return cloneElement(child, {
          ...child?.props,
          isOpen: openedIndexes.includes(index),
          onClick: () => {
            onToggleItem(index);
            child.props.onClick?.();
          },
        });
      })}
    </div>
  );
};

Collapse.Item = CollapseItem;

interface CollapseItemProps {
  isOpen?: boolean;
  onClick?: () => void;
  title: string;
  children: React.ReactNode;
}
function CollapseItem(props: CollapseItemProps) {
  const { children, isOpen, onClick, title } = props;

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
    <div className={styles.item} onClick={onClick}>
      <div className={styles.head}>
        <p>{title}</p>
        <div>
          <div className={clsx(styles.arrow, isOpen && styles.down)}></div>
        </div>
      </div>
      <div className={clsx(styles.content, !isOpen && styles.closed)}>{children}</div>
    </div>
  );
}
