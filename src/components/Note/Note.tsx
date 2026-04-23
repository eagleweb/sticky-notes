import type { ChangeEvent, RefObject } from 'react';
import { memo, useRef, useCallback, useState, useEffect } from 'react';

import styles from './Note.module.css';
import { COLOR_MAP, MIN_NOTE_HEIGHT, MIN_NOTE_WIDTH, NOTE_COLORS } from '@constants/note';
import { useDrag } from '@hooks/useDrag';
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
  const originRef = useRef({ x: 0, y: 0 });
  const noteRef = useRef<HTMLDivElement>(null);
  const [overTrash, setOverTrash] = useState(false);
  const [showColors, setShowColors] = useState(false);

  useEffect(() => {
    if (!showColors) {
      return;
    }
    const handleClickOutside = (e: MouseEvent) => {
      if (noteRef.current && !noteRef.current.contains(e.target as Node)) {
        setShowColors(false);
      }
    };
    document.addEventListener('pointerdown', handleClickOutside);
    return () => {
      document.removeEventListener('pointerdown', handleClickOutside);
    };
  }, [showColors]);

  const isNoteOverTrash = useCallback((): boolean => {
    const trash = trashRef.current;
    const noteEl = noteRef.current;
    if (!trash || !noteEl) {
      return false;
    }
    const trashRect = trash.getBoundingClientRect();
    const noteRect = noteEl.getBoundingClientRect();
    return (
      noteRect.right >= trashRect.left &&
      noteRect.left <= trashRect.right &&
      noteRect.bottom >= trashRect.top &&
      noteRect.top <= trashRect.bottom
    );
  }, [trashRef]);

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
        const minVisible = 20;
        const bw = board.clientWidth;
        const bh = board.clientHeight;
        newX = Math.max(-note.width + minVisible, Math.min(newX, bw - minVisible));
        newY = Math.max(0, Math.min(newY, bh - minVisible));
      }
      onUpdate({
        id: note.id,
        x: newX,
        y: newY,
      });
      setOverTrash(isNoteOverTrash());
    },
    onDragEnd: () => {
      if (isNoteOverTrash()) {
        onRemove(note.id);
      }
      setOverTrash(false);
    },
  });

  const sizeOriginRef = useRef({ w: 0, h: 0 });

  const handleResizeDown = useDrag({
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
      setShowColors(false);
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
      <div
        className={styles.dragBar}
        onPointerDown={handleMoveDown}
        role="button"
        aria-label="Drag to move note"
        tabIndex={0}
      >
        <span className={styles.grip}>⋮⋮</span>
        <button
          className={styles.colorBtn}
          title="Change color"
          onPointerDown={(e) => {
            e.stopPropagation();
          }}
          onClick={() => {
            setShowColors((v) => !v);
          }}
        >
          ●
        </button>
      </div>

      <div className={styles.titleRow}>
        <input
          className={styles.title}
          value={note.title}
          onChange={handleTitleChange}
          placeholder="Untitled"
        />
      </div>

      {showColors && (
        <div className={styles.colorPicker}>
          {NOTE_COLORS.map((c) => (
            <button
              key={c}
              className={styles.colorSwatch}
              style={{ backgroundColor: COLOR_MAP[c] }}
              title={c}
              onClick={() => {
                handleColorChange(c);
              }}
            />
          ))}
        </div>
      )}

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
