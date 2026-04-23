import type { PointerEvent as ReactPointerEvent, RefObject } from 'react';
import { useCallback, useRef, useState } from 'react';

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

type UseNoteMoveResult = {
  overTrash: boolean;
  handleMoveDown: (e: ReactPointerEvent) => void;
};


export const useNoteMove = ({
  note,
  noteRef,
  trashRef,
  onUpdate,
  onRemove,
  onBringToFront,
}: UseNoteMoveParams): UseNoteMoveResult => {
  const originRef = useRef({ x: 0, y: 0 });
  const [overTrash, setOverTrash] = useState(false);

  const isNoteOverTrash = useCallback(
    () => isOverlapping(noteRef.current, trashRef.current),
    [noteRef, trashRef],
  );

  const handleMoveDown = useDrag({
    onDragStart: () => {
      originRef.current = { x: note.x, y: note.y };
      onBringToFront(note.id);
    },
    onDragMove: (dx, dy) => {
      const board = noteRef.current?.parentElement;
      let newX = originRef.current.x + dx;
      let newY = originRef.current.y + dy;
      if (board) {
        const bw = board.clientWidth;
        const bh = board.clientHeight;
        newX = Math.max(-note.width + MIN_VISIBLE, Math.min(newX, bw - MIN_VISIBLE));
        newY = Math.max(0, Math.min(newY, bh - MIN_VISIBLE));
      }
      onUpdate({ id: note.id, x: newX, y: newY });
      setOverTrash(isNoteOverTrash());
    },
    onDragEnd: () => {
      if (isNoteOverTrash()) {
        onRemove(note.id);
      }
      setOverTrash(false);
    },
  });

  return { overTrash, handleMoveDown };
};

