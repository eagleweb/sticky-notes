import type { PointerEvent as ReactPointerEvent } from 'react';
import { useRef } from 'react';

import { MIN_NOTE_HEIGHT, MIN_NOTE_WIDTH } from '@constants/note';
import { useDrag } from '@hooks/useDrag';
import type { Note, NoteUpdate } from '@typeDefs/note';

type UseNoteResizeParams = {
  note: Note;
  onUpdate: (payload: NoteUpdate) => void;
  onBringToFront: (id: string) => void;
};

export const useNoteResize = ({
  note,
  onUpdate,
  onBringToFront,
}: UseNoteResizeParams): ((e: ReactPointerEvent) => void) => {
  const sizeOriginRef = useRef({ w: 0, h: 0 });

  return useDrag({
    onDragStart: () => {
      sizeOriginRef.current = { w: note.width, h: note.height };
      onBringToFront(note.id);
    },
    onDragMove: (dx, dy) => {
      onUpdate({
        id: note.id,
        width: Math.max(MIN_NOTE_WIDTH, sizeOriginRef.current.w + dx),
        height: Math.max(MIN_NOTE_HEIGHT, sizeOriginRef.current.h + dy),
      });
    },
  });
};

