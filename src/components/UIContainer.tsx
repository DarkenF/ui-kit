import { Modal } from './Modal/Modal.tsx';
import { Drawer } from './Drawer/Drawer.tsx';
import { useRef, useState } from 'react';
import { Tooltip } from './Tooltip/Tooltip.tsx';
import { Popover } from './Popover/Popover.tsx';
import { Dropdown } from './Dropdown/Dropdown.tsx';
import { Autocomplete, Option } from './Autocomplete/Autocomplete.tsx';

export const UiContainer = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const anchorElementRef = useRef<HTMLButtonElement | null>(null);
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const [selectedValue, setSelectedValue] = useState<string>('');
  const [selectedValue2, setSelectedValue2] = useState<string>('');

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

      <div>
        <button ref={anchorElementRef} onClick={() => setOpenDropdown((prev) => !prev)}>
          Dropdown
        </button>
        <Dropdown
          isOpen={openDropdown}
          onClose={() => setOpenDropdown(false)}
          anchorElementRef={anchorElementRef}
        >
          <Dropdown.Item>1</Dropdown.Item>
          <Dropdown.Item>2</Dropdown.Item>
          <Dropdown.Item>3</Dropdown.Item>
        </Dropdown>
      </div>
      <div>
        <Autocomplete
          onChange={setSelectedValue}
          options={[
            { label: 'label 1', value: '1' },
            { label: 'label 2', value: '2' },
            { label: 'label 3', value: '3' },
          ]}
          selected={selectedValue}
        ></Autocomplete>
      </div>
      <div>
        <Autocomplete
          onChange={setSelectedValue2}
          selected={selectedValue2}
          asyncOptions={() =>
            new Promise<Option[]>((resolve) => {
              setTimeout(() => {
                resolve([
                  { label: 'async label 1', value: '1' },
                  { label: 'async label 2', value: '2' },
                ]);
              }, 2000);
            })
          }
        ></Autocomplete>
      </div>
    </div>
  );
};
