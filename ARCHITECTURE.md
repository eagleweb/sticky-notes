# Architecture

## Functionality

- **Create notes** — double-click anywhere on the board to add a sticky note
- **Move notes** — drag a note by its top bar; position is clamped so the note never leaves the visible board area
- **Resize notes** — drag the bottom-right corner handle (minimum size enforced)
- **Edit notes** — inline editable title and multi-line text body
- **Change color** — per-note color picker (yellow, pink, blue, green, orange, purple)
- **Z-order** — clicking or dragging a note brings it to the front
- **Delete note** — drag a note onto the trash zone at the bottom
- **Persistence** — notes auto-save to `localStorage` via a debounced mock REST API (500 ms), surviving page reloads

## Aditional Features
- **Clear all** — toolbar button removes every note at once
- **Viewport** — don't allow notes to be dragged outside the visible area of the board; resizing is also constrained to prevent overflow

## Architecture & Design Decisions

- **Unidirectional data flow** — a single `useNotesStore` hook owns all note state through `useReducer` with a discriminated-union action type; data flows down via props to memoized presentational components
- **`useReducer` over Context** — the reducer lives in the top-level `App` and passes callbacks as props. Context is intentionally avoided because every note would re-render on any context change; with props + `memo`, only the affected `NoteCard` re-renders
- **No external state library** — `useReducer` is sufficient for this scope; it keeps the dependency graph flat, the bundle small, and the logic easy to trace
- **Folder-per-component** — each component (`Board`, `Note`, `Toolbar`, `TrashZone`) has its own folder with a co-located `.module.css` file for scoped styling
- **Path aliases** — `@components`, `@constants`, `@hooks`, `@store`, `@typeDefs`, `@api` keep imports clean and avoid deep relative paths
- **Drag interactions via `useDrag` hook** — a single reusable hook built on the Pointer Events API with `setPointerCapture`; callbacks are stored in refs to produce a stable handler identity and avoid re-renders; positional deltas are computed from the initial pointer-down coordinates and applied to the note's stored origin, preventing cumulative floating-point drift
- **Mock API layer** — all persistence goes through `src/api/mockApi.ts` which returns Promises with a simulated delay, making it trivial to swap in a real HTTP backend later

## Tooling

- **Vite 8** — dev server and production bundler (`@vitejs/plugin-react` for Fast Refresh)
- **TypeScript 6** — strict mode, `verbatimModuleSyntax`, `noUnusedLocals`/`noUnusedParameters` enabled
- **ESLint 10** (flat config) with:
  - `typescript-eslint` — strict + stylistic type-checked rule sets
  - `eslint-plugin-react` / `react-hooks` / `react-refresh` — React-specific linting
  - `eslint-plugin-import-x` — enforced import ordering, no default exports (except entry files), cycle detection
  - `eslint-config-prettier` — disables formatting rules that conflict with Prettier
- **Prettier 3** — single quotes, trailing commas, 100-char print width, LF line endings
- **CSS Modules** — scoped class names, no global style leaks
