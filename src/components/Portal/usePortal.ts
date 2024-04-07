import { useEffect, useRef } from 'react';

const createRootElement = (id: string) => {
  const rootContainer = document.createElement('div');
  rootContainer.setAttribute('id', id);
  return rootContainer;
};

export const usePortal = (id: string) => {
  const rootElemRef = useRef<HTMLDivElement>(document.createElement('div'));

  useEffect(() => {
    const existingParent = document.getElementById(id) as HTMLElement;
    const parentElem = existingParent || createRootElement(id);

    if (!existingParent) {
      document.body.appendChild(parentElem);
    }

    parentElem.appendChild(rootElemRef.current);

    return () => {
      rootElemRef.current.remove();
    };
  }, [id]);

  return rootElemRef.current;
};
