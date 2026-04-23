import type { Note } from '@typeDefs/note';
import { delay } from '@utils/delay';

const STORAGE_KEY = 'sticky-notes';
const SIMULATED_DELAY_MS = 150;


const readStore = (): Note[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw !== null ? (JSON.parse(raw) as Note[]) : [];
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
