import { Modal } from './Modal/Modal.tsx';
import { Drawer } from './Drawer/Drawer.tsx';
import { useState } from 'react';
import { Tooltip } from './Tooltip/Tooltip.tsx';
import { Popover } from './Popover/Popover.tsx';

export const UiContainer = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  return (
    <div>
      <button onClick={() => setIsModalOpen((prev) => !prev)}>open modal</button>
      <button onClick={() => setIsDrawerOpen((prev) => !prev)}>open drawer</button>

      <Tooltip text="Текст для тултипа">
        {(props) => <span {...props}>Наведи</span>}
      </Tooltip>

      <Popover content={<div>Контент!</div>}>
        {(props) => <button {...props}>Click</button>}
      </Popover>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        position="left"
      >
        <button onClick={() => setIsModalOpen((prev) => !prev)}>open modal</button>
      </Drawer>
    </div>
  );
};
