import type { Note } from '@typeDefs/note';
import { delay } from '@utils/delay';

const STORAGE_KEY = 'sticky-notes';
const SIMULATED_DELAY_MS = 150;

const isNote = (value: unknown): value is Note => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.id === 'string' &&
    typeof obj.x === 'number' &&
    typeof obj.y === 'number' &&
    typeof obj.width === 'number' &&
    typeof obj.height === 'number' &&
    typeof obj.title === 'string' &&
    typeof obj.text === 'string' &&
    typeof obj.color === 'string' &&
    typeof obj.zIndex === 'number'
  );
};

const readStore = (): Note[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      return [];
    }
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(isNote);
  } catch {
    return [];
  }
};

const writeStore = (notes: Note[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
};

export const fetchNotes = async (): Promise<Note[]> => {
  await delay(SIMULATED_DELAY_MS);
  return readStore();
};

export const saveAllNotes = async (notes: Note[]): Promise<void> => {
  await delay(SIMULATED_DELAY_MS);
  writeStore(notes);
};
