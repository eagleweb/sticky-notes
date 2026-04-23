import { useState, useRef } from 'react';

import styles from './App.module.css';
import { Board } from '@components/Board/Board';
import { Toolbar } from '@components/Toolbar/Toolbar';
import { TrashZone } from '@components/TrashZone/TrashZone';
import { DEFAULT_NOTE_COLOR } from '@constants/note';
import { useNotesStore } from '@store/useNotesStore';
import type { NoteColor } from '@typeDefs/note';

export const App = () => {
  const { notes, addNote, updateNote, removeNote, bringToFront, clearAll } = useNotesStore();
  const [selectedColor, setSelectedColor] = useState<NoteColor>(DEFAULT_NOTE_COLOR);
  const trashRef = useRef<HTMLDivElement>(null);

  return (
    <div className={styles.root}>
      <Toolbar
        selectedColor={selectedColor}
        onColorChange={setSelectedColor}
        hasNotes={notes.length > 0}
        onClearAll={clearAll}
      />
      <Board
        notes={notes}
        selectedColor={selectedColor}
        onAddNote={addNote}
        onUpdateNote={updateNote}
        onRemoveNote={removeNote}
        onBringToFront={bringToFront}
        trashRef={trashRef}
      />
      <TrashZone ref={trashRef} />
    </div>
  );
};
