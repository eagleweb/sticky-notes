import { memo } from 'react';

import styles from './Toolbar.module.css';
import { COLOR_MAP, NOTE_COLORS } from '@constants/note';
import type { NoteColor } from '@typeDefs/note';

type ToolbarProps = {
  selectedColor: NoteColor;
  onColorChange: (color: NoteColor) => void;
  hasNotes: boolean;
  onClearAll: () => void;
};

export const Toolbar = memo<ToolbarProps>(function Toolbar({
  selectedColor,
  onColorChange,
  hasNotes,
  onClearAll,
}) {
  const handleClearAll = () => {
    if (window.confirm('Delete all notes? This cannot be undone.')) {
      onClearAll();
    }
  };

  return (
    <div className={styles.root}>
      {hasNotes && (
        <button className={styles.clearBtn} onClick={handleClearAll} title="Delete all notes">
          🗑 Clear all
        </button>
      )}
      <div className={styles.spacer} />
      <span className={styles.label}>New note color:</span>
      <div className={styles.colors}>
        {NOTE_COLORS.map((c) => (
          <button
            key={c}
            className={
              c === selectedColor ? `${styles.swatch} ${styles.swatchActive}` : styles.swatch
            }
            style={{ backgroundColor: COLOR_MAP[c] }}
            title={c}
            onClick={() => {
              onColorChange(c);
            }}
          />
        ))}
      </div>
    </div>
  );
});
