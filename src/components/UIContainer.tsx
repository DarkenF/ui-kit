import { Modal } from './Modal/Modal.tsx';
import { Drawer } from './Drawer/Drawer.tsx';
import { useRef, useState } from 'react';
import { Tooltip } from './Tooltip/Tooltip.tsx';
import { Popover } from './Popover/Popover.tsx';
import { Dropdown } from './Dropdown/Dropdown.tsx';
import { Autocomplete } from './Autocomplete/Autocomplete.tsx';
import axios from 'axios';

type ModifyOption = {
  id: string;
  label: string;
  secondaryLabel: string;
};
export const UiContainer = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const anchorElementRef = useRef<HTMLButtonElement | null>(null);
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const [selectedValue, setSelectedValue] = useState<ModifyOption>();
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
        <Autocomplete<ModifyOption>
          onChange={(_v, option) => {
            setSelectedValue(option);
          }}
          options={[
            { label: 'label 1', id: '1', secondaryLabel: '' },
            { label: 'label 2', id: '2', secondaryLabel: '' },
            { label: 'label 3', id: '3', secondaryLabel: '' },
          ]}
          selected={selectedValue}
        ></Autocomplete>
      </div>
      <div>
        <Autocomplete
          onChange={setSelectedValue2}
          selected={selectedValue2}
          options={async (_inputValue, abortSignal) => {
            try {
              const response = await axios.get(
                'https://6651ecab20f4f4c442792a6a.mockapi.io/options',
                { signal: abortSignal },
              );

              return response.data;
            } catch (e) {
              console.log(e);
              return [];
            }
          }}
        ></Autocomplete>
      </div>
    </div>
  );
};
