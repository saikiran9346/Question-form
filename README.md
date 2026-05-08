# Nested Form Builder

A dynamic React form where users can add questions and unlimited levels of nested sub-questions.

## Features

- ✅ Add / delete parent questions dynamically
- ✅ Two question types: **Short Answer** & **True / False**
- ✅ Nested child questions appear when a True/False answer is set to **True** (recursive, unlimited depth)
- ✅ Auto-numbering in hierarchical format: `Q1`, `Q1.1`, `Q1.1.1`, `Q2`, …
- ✅ Delete any question (removes all its children too)
- ✅ **Drag-and-drop** reordering of parent questions (`@dnd-kit`)
- ✅ **LocalStorage persistence** — progress is saved automatically
- ✅ Form submission shows a full hierarchical review

## Tech Stack

| Tech | Purpose |
|------|---------|
| React 18 + Hooks | UI & state management |
| @dnd-kit/core & sortable | Drag-and-drop reordering |
| localStorage API | Auto-save persistence |
| CSS (custom, single file) | All styles in `src/styles/styles.css` |

## Project Structure

```
nested-form/
├── public/
│   └── index.html
├── src/
│   ├── App.jsx                  ← root component, all state lives here
│   ├── index.js                 ← React entry point
│   ├── styles/
│   │   └── styles.css           ← ALL CSS in one file
│   ├── components/
│   │   ├── Question.jsx         ← recursive question component
│   │   └── SubmitView.jsx       ← read-only hierarchical review
│   └── utils/
│       └── questionUtils.js     ← pure helper functions (create/delete/update/addChild)
├── package.json
└── README.md
```

## Setup & Run

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm start
```

App opens at **http://localhost:3000**

## How it works

### Data Model
Each question is a plain object:
```js
{
  id: string,       // unique id
  text: string,     // question text
  type: 'short' | 'truefalse',
  answer: '' | 'true' | 'false',
  children: Question[]   // nested sub-questions
}
```

### Key Logic
- **Auto-numbering** — computed on render by passing a prefix string down the component tree (`Q1` → `Q1.1` → `Q1.1.1`)
- **Recursive update/delete** — `questionUtils.js` has pure recursive functions that walk the tree without mutation
- **Drag-and-drop** — only top-level questions are sortable via `@dnd-kit/sortable`
- **LocalStorage** — `useEffect` writes the full tree to localStorage on every state change; loaded once on mount via lazy initializer