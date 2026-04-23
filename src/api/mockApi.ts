import type { Note } from '@typeDefs/note';

const STORAGE_KEY = 'sticky-notes';
const SIMULATED_DELAY_MS = 150;

const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

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
