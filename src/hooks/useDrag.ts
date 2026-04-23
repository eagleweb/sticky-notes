import type { PointerEvent as ReactPointerEvent } from 'react';
import { useCallback, useEffect, useRef } from 'react';

export interface DragCallbacks {
  onDragStart?: (e: PointerEvent) => void;
  onDragMove: (dx: number, dy: number, e: PointerEvent) => void;
  onDragEnd?: (e: PointerEvent) => void;
}

export const useDrag = (callbacks: DragCallbacks): ((e: ReactPointerEvent) => void) => {
  const startPos = useRef({ x: 0, y: 0 });
  const callbacksRef = useRef(callbacks);

  useEffect(() => {
    callbacksRef.current = callbacks;
  });

  return useCallback((e: ReactPointerEvent) => {
    if (e.button !== 0) {
      return;
    }
    e.stopPropagation();

    const target = e.currentTarget as HTMLElement;
    target.setPointerCapture(e.pointerId);

    startPos.current = { x: e.clientX, y: e.clientY };
    callbacksRef.current.onDragStart?.(e.nativeEvent);

    const onMove = (ev: PointerEvent) => {
      const dx = ev.clientX - startPos.current.x;
      const dy = ev.clientY - startPos.current.y;
      callbacksRef.current.onDragMove(dx, dy, ev);
    };

    const onUp = (ev: PointerEvent) => {
      target.releasePointerCapture(ev.pointerId);
      target.removeEventListener('pointermove', onMove);
      target.removeEventListener('pointerup', onUp);
      callbacksRef.current.onDragEnd?.(ev);
    };

    target.addEventListener('pointermove', onMove);
    target.addEventListener('pointerup', onUp);
  }, []);
};
