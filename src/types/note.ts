import type {
  ACTION_ADD,
  ACTION_BRING_TO_FRONT,
  ACTION_CLEAR_ALL,
  ACTION_LOAD,
  ACTION_REMOVE,
  ACTION_UPDATE,
} from '@constants/actions';

export interface Note {
  readonly id: string;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly title: string;
  readonly text: string;
  readonly color: NoteColor;
  readonly zIndex: number;
}

export type NoteCreateParams = Pick<Note, 'x' | 'y' | 'color'>;

export type NoteUpdate = { id: string } & Partial<Omit<Note, 'id'>>;

export type NoteColor = 'yellow' | 'pink' | 'blue' | 'green' | 'orange' | 'purple';

export type NotesAction =
  | { type: typeof ACTION_ADD; payload: NoteCreateParams }
  | { type: typeof ACTION_UPDATE; payload: NoteUpdate }
  | { type: typeof ACTION_REMOVE; payload: string }
  | { type: typeof ACTION_CLEAR_ALL }
  | { type: typeof ACTION_BRING_TO_FRONT; payload: string }
  | { type: typeof ACTION_LOAD; payload: Note[] };
