import { memo, useCallback, useRef, useState } from 'react';

import styles from './Note.module.css';
import { COLOR_MAP, NOTE_COLORS } from '@constants/note';
import { useClickOutside } from '@hooks/useClickOutside';
import type { NoteColor } from '@typeDefs/note';

type ColorPickerProps = {
  onColorChange: (color: NoteColor) => void;
};

export const ColorPicker = memo<ColorPickerProps>(function ColorPicker({ onColorChange }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const close = useCallback(() => {
    setOpen(false);
  }, []);

  useClickOutside(containerRef, open, close);

  const handleSelect = useCallback(
    (color: NoteColor) => {
      onColorChange(color);
      setOpen(false);
    },
    [onColorChange],
  );

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <button
        className={styles.colorBtn}
        title="Change color"
        onPointerDown={(e) => {
          e.stopPropagation();
        }}
        onClick={() => {
          setOpen((v) => !v);
        }}
      >
        ●
      </button>
      {open && (
        <div className={styles.colorPicker}>
          {NOTE_COLORS.map((c) => (
            <button
              key={c}
              className={styles.colorSwatch}
              style={{ backgroundColor: COLOR_MAP[c] }}
              title={c}
              onClick={() => {
                handleSelect(c);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
});

