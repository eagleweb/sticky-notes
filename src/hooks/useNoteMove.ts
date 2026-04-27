import type { PointerEvent as ReactPointerEvent, RefObject } from 'react';
import { useCallback, useRef } from 'react';

import { useDrag } from '@hooks/useDrag';
import type { Note, NoteUpdate } from '@typeDefs/note';
import { isOverlapping } from '@utils/isOverlapping';

const MIN_VISIBLE = 20;

type UseNoteMoveParams = {
  note: Note;
  noteRef: RefObject<HTMLElement | null>;
  trashRef: RefObject<HTMLElement | null>;
  onUpdate: (payload: NoteUpdate) => void;
  onRemove: (id: string) => void;
  onBringToFront: (id: string) => void;
};

export const useNoteMove = ({
  note,
  noteRef,
  trashRef,
  onUpdate,
  onRemove,
  onBringToFront,
}: UseNoteMoveParams): ((e: ReactPointerEvent) => void) => {
  const originRef = useRef({ x: 0, y: 0 });
  const finalPos = useRef({ x: 0, y: 0 });

  const isNoteOverTrash = useCallback(
    () => isOverlapping(noteRef.current, trashRef.current),
    [noteRef, trashRef],
  );

  const setOverTrash = (over: boolean) => {
    noteRef.current?.toggleAttribute('data-over-trash', over);
    trashRef.current?.toggleAttribute('data-trash-active', over);
  };

  return useDrag({
    onDragStart: () => {
      originRef.current = { x: note.x, y: note.y };
      onBringToFront(note.id);
    },
    onDragMove: (dx, dy) => {
      const el = noteRef.current;
      const board = el?.parentElement;
      let newX = originRef.current.x + dx;
      let newY = originRef.current.y + dy;
      if (board) {
        const bw = board.clientWidth;
        const bh = board.clientHeight;
        newX = Math.max(-note.width + MIN_VISIBLE, Math.min(newX, bw - MIN_VISIBLE));
        newY = Math.max(0, Math.min(newY, bh - MIN_VISIBLE));
      }
      finalPos.current = { x: newX, y: newY };

      if (el) {
        el.style.left = `${String(newX)}px`;
        el.style.top = `${String(newY)}px`;
      }

      setOverTrash(isNoteOverTrash());
    },
    onDragEnd: () => {
      if (isNoteOverTrash()) {
        onRemove(note.id);
      } else {
        onUpdate({ id: note.id, x: finalPos.current.x, y: finalPos.current.y });
      }
      setOverTrash(false);
    },
  });
};
