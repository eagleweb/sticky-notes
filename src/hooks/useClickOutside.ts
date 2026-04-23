import type { RefObject } from 'react';
import { useEffect } from 'react';

export const useClickOutside = (
  ref: RefObject<HTMLElement | null>,
  active: boolean,
  onOutside: () => void,
): void => {
  useEffect(() => {
    if (!active) {
      return;
    }
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onOutside();
      }
    };
    document.addEventListener('pointerdown', handler);
    return () => {
      document.removeEventListener('pointerdown', handler);
    };
  }, [ref, active, onOutside]);
};
