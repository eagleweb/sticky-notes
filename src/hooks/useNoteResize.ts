import type { PointerEvent as ReactPointerEvent, RefObject } from 'react';
import { useRef } from 'react';

import { MIN_NOTE_HEIGHT, MIN_NOTE_WIDTH } from '@constants/note';
import { useDrag } from '@hooks/useDrag';
import type { Note, NoteUpdate } from '@typeDefs/note';

type UseNoteResizeParams = {
  note: Note;
  noteRef: RefObject<HTMLElement | null>;
  onUpdate: (payload: NoteUpdate) => void;
  onBringToFront: (id: string) => void;
};

export const useNoteResize = ({
  note,
  noteRef,
  onUpdate,
  onBringToFront,
}: UseNoteResizeParams): ((e: ReactPointerEvent) => void) => {
  const sizeOriginRef = useRef({ w: 0, h: 0 });
  const finalSize = useRef({ w: 0, h: 0 });

  return useDrag({
    onDragStart: () => {
      sizeOriginRef.current = { w: note.width, h: note.height };
      onBringToFront(note.id);
    },
    onDragMove: (dx, dy) => {
      const newW = Math.max(MIN_NOTE_WIDTH, sizeOriginRef.current.w + dx);
      const newH = Math.max(MIN_NOTE_HEIGHT, sizeOriginRef.current.h + dy);
      finalSize.current = { w: newW, h: newH };

      const el = noteRef.current;
      if (el) {
        el.style.width = `${String(newW)}px`;
        el.style.height = `${String(newH)}px`;
      }
    },
    onDragEnd: () => {
      onUpdate({
        id: note.id,
        width: finalSize.current.w,
        height: finalSize.current.h,
      });
    },
  });
};
