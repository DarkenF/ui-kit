import { Dropdown } from '../Dropdown';
import { useEffect, useMemo, useRef, useState } from 'react';

import styles from './Autocomplete.module.scss';
import { Loader } from '../Loader/Loader.tsx';
import { useEvent } from '../../hooks/useEvent.ts';
export interface Option {
  label: string;
  value: string;
  [key: string]: any;
}
interface Props {
  options?: Option[];
  asyncOptions?: (inputValue?: string) => Promise<Option[]>;
  onChange: (value: string, option: Option) => void;
  selected: Option | string | undefined;
}

export const Autocomplete = (props: Props) => {
  const { options, selected, onChange, asyncOptions } = props;

  const memoizedAsyncOptionsHandler =
    useEvent<(inputValue?: string) => Promise<Option[]>>(asyncOptions);

  const [open, setOpen] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');
  const ref = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [localOptions, setLocalOptions] = useState<Option[]>(options || []);
  const [isOptionsLoading, setIsOptionsLoading] = useState<boolean>(false);

  const value = useMemo(() => {
    const normalizeValue = typeof selected === 'string' ? selected : selected?.value;
    const matchedOption = localOptions.find((item) => item.value === normalizeValue);

    return matchedOption;
  }, [selected, localOptions]);

  const filteredOptions = useMemo(() => {
    return localOptions.filter((item) =>
      item.label.toLowerCase().includes(inputValue.toLowerCase()),
    );
  }, [localOptions, inputValue]);

  const onDropdownOpen = () => {
    setOpen((prev) => !prev);
    setInputValue(value?.label || '');
  };

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    const requestFn = memoizedAsyncOptionsHandler(inputValue);

    if (!requestFn) {
      return;
    }

    setIsOptionsLoading(true);

    requestFn
      .then((res) => {
        setLocalOptions(res);
      })
      .finally(() => {
        setIsOptionsLoading(false);
      });
  }, [inputValue]);

  return (
    <div className={styles.select}>
      <div ref={ref}>
        {!open ? (
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
          <div onClick={onDropdownOpen} className={styles.inputPlaceholder}>
            {isOptionsLoading && <Loader />}
            {value?.label}
          </div>
        ) : (
          <input
            ref={inputRef}
            className={styles.input}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            type="text"
          />
        )}
      </div>
      <Dropdown
        anchorElementRef={ref}
        isLoading={isOptionsLoading}
        isOpen={open}
        onClose={() => setOpen(false)}
      >
        {filteredOptions.map((option) => (
          <Dropdown.Item
            key={option.value + option.label}
            onClick={() => onChange(option.value, option)}
          >
            {option.label}
          </Dropdown.Item>
        ))}
      </Dropdown>
    </div>
  );
};
