import { useMemo, useState } from 'react';

export const useSet = <T>(initValue?: Iterable<T>) => {
  const [set] = useState(() => new Set<T>(initValue));
  const [size, setSize] = useState<number>(set.size);

  return useMemo(
    () => ({
      get set() {
        return set;
      },
      getSize() {
        return size;
      },
      add(v: T) {
        set.add(v);
        setSize(set.size);
        return set;
      },
      remove(v: T) {
        const result = set.delete(v);
        setSize(set.size);
        return result;
      },
      has(v: T) {
        return set.has(v);
      },
      clear() {
        setSize(0);
        return set.clear();
      },
    }),
    [set, size],
  );
};
