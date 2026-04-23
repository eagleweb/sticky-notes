import type { NoteColor } from '@typeDefs/note';

export const DEFAULT_NOTE_COLOR: NoteColor = 'yellow';

export const NOTE_COLORS: readonly NoteColor[] = [
  'yellow',
  'pink',
  'blue',
  'green',
  'orange',
  'purple',
];

export const COLOR_MAP: Record<NoteColor, string> = {
  yellow: '#fef08a',
  pink: '#fda4af',
  blue: '#93c5fd',
  green: '#86efac',
  orange: '#fdba74',
  purple: '#c4b5fd',
};

export const DEFAULT_NOTE_WIDTH = 200;
export const DEFAULT_NOTE_HEIGHT = 200;
export const MIN_NOTE_WIDTH = 120;
export const MIN_NOTE_HEIGHT = 80;
