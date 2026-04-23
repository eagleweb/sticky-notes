import { useReducer, useEffect, useCallback, useRef } from 'react';

import { fetchNotes, saveAllNotes } from '@api/mockApi';
import {
  ACTION_ADD,
  ACTION_BRING_TO_FRONT,
  ACTION_CLEAR_ALL,
  ACTION_LOAD,
  ACTION_REMOVE,
  ACTION_UPDATE,
} from '@constants/actions';
import { DEFAULT_NOTE_HEIGHT, DEFAULT_NOTE_WIDTH } from '@constants/note';
import type { Note, NoteCreateParams, NoteUpdate, NotesAction } from '@typeDefs/note';
import { generateId } from '@utils/generateId';

const PERSIST_DEBOUNCE_MS = 500;


const notesReducer = (state: Note[], action: NotesAction): Note[] => {
  switch (action.type) {
    case ACTION_ADD:
      return [...state, action.payload];

    case ACTION_UPDATE:
      return state.map((n) => (n.id === action.payload.id ? { ...n, ...action.payload } : n));

    case ACTION_REMOVE:
      return state.filter((n) => n.id !== action.payload);

    case ACTION_CLEAR_ALL:
      return [];

    case ACTION_BRING_TO_FRONT: {
      const maxZ = state.reduce((max, n) => Math.max(max, n.zIndex), 0);
      return state.map((n) => (n.id === action.payload ? { ...n, zIndex: maxZ + 1 } : n));
    }

    case ACTION_LOAD:
      return action.payload;
  }
};

export type NotesStore = {
  notes: Note[];
  addNote: (params: NoteCreateParams) => void;
  updateNote: (payload: NoteUpdate) => void;
  removeNote: (id: string) => void;
  bringToFront: (id: string) => void;
  clearAll: () => void;
};

export const useNotesStore = (): NotesStore => {
  const [notes, dispatch] = useReducer(notesReducer, []);
  const loaded = useRef(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>();
  const nextZRef = useRef(0);

  useEffect(() => {
    fetchNotes()
      .then((saved) => {
        dispatch({ type: ACTION_LOAD, payload: saved });
        nextZRef.current = saved.reduce((max, n) => Math.max(max, n.zIndex), 0) + 1;
        loaded.current = true;
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!loaded.current) {
      return;
    }

    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      saveAllNotes(notes).catch(console.error);
    }, PERSIST_DEBOUNCE_MS);

    return () => {
      clearTimeout(debounceTimer.current);
    };
  }, [notes]);

  const addNote = useCallback((params: NoteCreateParams) => {
    const note: Note = {
      id: generateId(),
      x: params.x,
      y: params.y,
      width: DEFAULT_NOTE_WIDTH,
      height: DEFAULT_NOTE_HEIGHT,
      title: '',
      text: '',
      color: params.color,
      zIndex: nextZRef.current++,
    };
    dispatch({ type: ACTION_ADD, payload: note });
  }, []);

  const updateNote = useCallback((payload: NoteUpdate) => {
    dispatch({ type: ACTION_UPDATE, payload });
  }, []);

  const removeNote = useCallback((id: string) => {
    dispatch({ type: ACTION_REMOVE, payload: id });
  }, []);

  const bringToFront = useCallback((id: string) => {
    dispatch({ type: ACTION_BRING_TO_FRONT, payload: id });
  }, []);

  const clearAll = useCallback(() => {
    dispatch({ type: ACTION_CLEAR_ALL });
  }, []);

  return { notes, addNote, updateNote, removeNote, bringToFront, clearAll };
};
