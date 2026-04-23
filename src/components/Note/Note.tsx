import type { ChangeEvent, RefObject } from 'react';
import { memo, useRef, useCallback } from 'react';

import { ColorPicker } from './ColorPicker';
import styles from './Note.module.css';
import { COLOR_MAP } from '@constants/note';
import { useNoteMove } from '@hooks/useNoteMove';
import { useNoteResize } from '@hooks/useNoteResize';
import type { Note as NoteType, NoteColor, NoteUpdate } from '@typeDefs/note';

type NoteProps = {
  note: NoteType;
  onUpdate: (payload: NoteUpdate) => void;
  onRemove: (id: string) => void;
  onBringToFront: (id: string) => void;
  trashRef: RefObject<HTMLDivElement | null>;
};

export const NoteCard = memo<NoteProps>(function NoteCard({
  note,
  onUpdate,
  onRemove,
  onBringToFront,
  trashRef,
}) {
  const noteRef = useRef<HTMLDivElement>(null);

  const { overTrash, handleMoveDown } = useNoteMove({
    note,
    noteRef,
    trashRef,
    onUpdate,
    onRemove,
    onBringToFront,
  });

  const handleResizeDown = useNoteResize({ note, onUpdate, onBringToFront });

  const handleTextChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      onUpdate({ id: note.id, text: e.target.value });
    },
    [note.id, onUpdate],
  );

  const handleTitleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onUpdate({ id: note.id, title: e.target.value });
    },
    [note.id, onUpdate],
  );

  const handleColorChange = useCallback(
    (color: NoteColor) => {
      onUpdate({ id: note.id, color });
    },
    [note.id, onUpdate],
  );

  const rootClass = overTrash ? `${styles.root} ${styles.overTrash}` : styles.root;

  return (
    <div
      ref={noteRef}
      className={rootClass}
      style={{
        left: note.x,
        top: note.y,
        width: note.width,
        height: note.height,
        zIndex: note.zIndex,
        backgroundColor: COLOR_MAP[note.color],
      }}
    >
      <div className={styles.dragBar} onPointerDown={handleMoveDown} aria-label="Drag to move note">
        <span className={styles.grip}>⋮⋮</span>
        <ColorPicker onColorChange={handleColorChange} />
      </div>

      <div className={styles.titleRow}>
        <input
          className={styles.title}
          value={note.title}
          onChange={handleTitleChange}
          placeholder="Untitled"
        />
      </div>

      <textarea
        className={styles.text}
        value={note.text}
        onChange={handleTextChange}
        placeholder="Type here…"
      />

      <div className={styles.resize} onPointerDown={handleResizeDown} />
    </div>
  );
});
