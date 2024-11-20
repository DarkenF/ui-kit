import { Modal } from './Modal/Modal.tsx';
import { Drawer } from './Drawer/Drawer.tsx';
import { useRef, useState } from 'react';
import { Tooltip } from './Tooltip/Tooltip.tsx';
import { Popover } from './Popover/Popover.tsx';
import { Dropdown } from './Dropdown/Dropdown.tsx';
import { Autocomplete } from './Autocomplete/Autocomplete.tsx';
import axios from 'axios';
import { Collapse } from './Collpase/Collapse.tsx';
import { toaster } from './Toaster/Toaster.tsx';
import { toaster2 } from './Toaster/ToasterV2/Toaster.tsx';

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
          getLabel={(item) => item.label}
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
        <Autocomplete<ModifyOption>
          getLabel={(item) => item.label}
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

      <button onClick={() => toaster.addToast('Сообщение для тостера')}>
        open toaster
      </button>
      <button onClick={() => toaster2.addToast('Сообщение для тостера')}>
        open toaster 2
      </button>

      <div style={{ width: 300 }}>
        <Collapse>
          <Collapse.Item title="title 1">
            Lorem Ipsum - это текст-рыба, часто используемый в печати и вэб-дизайне. Lorem
            Ipsum является стандартной рыбой для текстов на латинице с начала XVI века. В
            то время некий безымянный печатник соз
          </Collapse.Item>
          <Collapse.Item title="title 2">
            Давно выяснено, что при оценке дизайна и композиции читаемый текст мешает
            сосредоточиться. Lorem Ipsum используют потому, что тот обеспечивает более или
            менее стандартное заполнение шаблона,
          </Collapse.Item>
          <Collapse.Item title="title 3">
            Есть много вариантов Lorem Ipsum, но большинство из них имеет не всегда
            приемлемые модификации, например, юмористические вставки или слова, которые
            даже отдалённо не напоминают латынь. Если вам нужен Lorem Ipsum для серьёзного
            проекта,
          </Collapse.Item>
        </Collapse>
      </div>
    </div>
  );
};
