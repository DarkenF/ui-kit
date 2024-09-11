import * as React from 'react';
import { Children, cloneElement } from 'react';
import { useSet } from '../../hooks/useSet.ts';

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

  const openedIndexSet = useSet<number>();

  const onToggleItem = (index: number) => {
    const isExist = openedIndexSet.has(index);

    if (isExist) {
      openedIndexSet.remove(index);
    } else {
      if (isSingle) {
        openedIndexSet.clear();
        openedIndexSet.add(index);
        return;
      }
      openedIndexSet.add(index);
    }
  };

  return (
    <div>
      {Children.map(children, (child, index) => {
        return cloneElement(child, {
          ...child?.props,
          isOpen: openedIndexSet.has(index),
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
