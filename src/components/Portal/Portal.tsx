import { usePortal } from './usePortal.ts';
import React, { FC } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  children: React.ReactElement;
}
export const Portal: FC<Props> = ({ children }) => {
  const portalContainer = usePortal('portal-container');

  return createPortal(children, portalContainer);
};
