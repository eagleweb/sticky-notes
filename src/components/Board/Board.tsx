import type { MouseEvent, RefObject } from 'react';
import { memo, useCallback } from 'react';

import styles from './Board.module.css';
import { NoteCard } from '../Note/Note';
import { DEFAULT_NOTE_HEIGHT, DEFAULT_NOTE_WIDTH } from '@constants/note';
import type { Note as NoteType, NoteColor, NoteCreateParams, NoteUpdate } from '@typeDefs/note';

type BoardProps = {
  notes: NoteType[];
  selectedColor: NoteColor;
  onAddNote: (params: NoteCreateParams) => void;
  onUpdateNote: (payload: NoteUpdate) => void;
  onRemoveNote: (id: string) => void;
  onBringToFront: (id: string) => void;
  trashRef: RefObject<HTMLDivElement | null>;
};

export const Board = memo<BoardProps>(function Board({
  notes,
  selectedColor,
  onAddNote,
  onUpdateNote,
  onRemoveNote,
  onBringToFront,
  trashRef,
}) {
  const handleDoubleClick = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (e.target !== e.currentTarget) {
        return;
      }

      const rect = e.currentTarget.getBoundingClientRect();
      const x = Math.min(
        Math.max(0, e.clientX - rect.left - DEFAULT_NOTE_WIDTH / 2),
        rect.width - DEFAULT_NOTE_WIDTH,
      );
      const y = Math.min(
        Math.max(0, e.clientY - rect.top - DEFAULT_NOTE_HEIGHT / 2),
        rect.height - DEFAULT_NOTE_HEIGHT,
      );

      onAddNote({ x, y, color: selectedColor });
    },
    [selectedColor, onAddNote],
  );

  return (
    <div className={styles.root} onDoubleClick={handleDoubleClick}>
      {notes.length === 0 && (
        <div className={styles.emptyHint}>Double-click on the board to create a note</div>
      )}
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          onUpdate={onUpdateNote}
          onRemove={onRemoveNote}
          onBringToFront={onBringToFront}
          trashRef={trashRef}
        />
      ))}
    </div>
  );
});
