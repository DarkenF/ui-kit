import { Dropdown } from '../Dropdown';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import styles from './Autocomplete.module.scss';
import { Loader } from '../Loader/Loader.tsx';
import { useEvent } from '../../hooks/useEvent.ts';

type AdvancedOption = Record<string, unknown>;

type Option<P extends AdvancedOption> = {
  label?: string;
  id: string;
} & P;

type AsyncOptionsFn<P extends AdvancedOption> = (
  inputValue?: string,
  abortSignal?: AbortSignal,
) => Promise<Option<P>[]>;

interface Props<P extends AdvancedOption> {
  options?: Option<P>[] | AsyncOptionsFn<P>;
  onChange: (value: string, option: Option<P>) => void;
  onChangeInputValue?: (value: string) => void;
  inputValue?: string;
  selected: Option<P> | string | undefined;
  renderOption?: (option: Option<P>) => React.ReactNode;
  getLabel?: (option: Option<P>) => string;
}

export const Autocomplete = <P extends AdvancedOption>(props: Props<P>) => {
  const {
    options,
    selected,
    onChange,
    renderOption,
    getLabel,
    onChangeInputValue,
    inputValue: outerInputValue,
  } = props;

  const isAsyncOptions = typeof options === 'function';

  const memoizedAsyncOptionsHandler = isAsyncOptions
    ? useEvent<AsyncOptionsFn<P>>(options)
    : undefined;

  const [open, setOpen] = useState<boolean>(false);
  const [localInputValue, setLocalInputValue] = useState<string>('');
  const ref = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [localOptions, setLocalOptions] = useState<Option<P>[]>(
    isAsyncOptions ? [] : (options as Option<P>[]),
  );
  const [isOptionsLoading, setIsOptionsLoading] = useState<boolean>(false);

  const inputValue =
    typeof outerInputValue !== 'undefined' ? outerInputValue : localInputValue;

  const value = useMemo(() => {
    const normalizeValue = typeof selected === 'string' ? selected : selected?.id;
    const matchedOption = localOptions.find((item) => item.id === normalizeValue);

    return matchedOption;
  }, [selected, localOptions]);

  const filteredOptions = useMemo(() => {
    return localOptions.filter((item) => {
      const label = item.label || getLabel?.(item);

      if (!label) {
        return [];
      }

      return label.toLowerCase().includes(inputValue.toLowerCase());
    });
  }, [localOptions, inputValue]);

  const onDropdownOpen = () => {
    setOpen((prev) => !prev);
    setLocalInputValue(value?.label || '');
  };

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    if (!memoizedAsyncOptionsHandler || !open) {
      return;
    }

    const requestFn = memoizedAsyncOptionsHandler(inputValue, signal);

    setIsOptionsLoading(true);

    requestFn
      .then((res) => {
        setLocalOptions(res);
      })
      .finally(() => {
        setIsOptionsLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [inputValue, open]);

  const getDisplayLabel = (option: Option<P> | undefined) => {
    if (!option) {
      return '';
    }

    if (renderOption) {
      return renderOption(option);
    }

    if (getLabel) {
      return getLabel(option);
    }

    return option.label;
  };

  return (
    <div className={styles.select}>
      <div ref={ref}>
        {!open ? (
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
          <div onClick={onDropdownOpen} className={styles.inputPlaceholder}>
            {isOptionsLoading && <Loader />}
            {getDisplayLabel(value)}
          </div>
        ) : (
          <input
            ref={inputRef}
            className={styles.input}
            value={inputValue}
            onChange={(e) => {
              const v = e.target.value;

              onChangeInputValue?.(v);
              setLocalInputValue(v);
            }}
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
            key={option.id + option.label}
            onClick={() => onChange(option.id, option)}
          >
            {getDisplayLabel(option)}
          </Dropdown.Item>
        ))}
      </Dropdown>
    </div>
  );
};
