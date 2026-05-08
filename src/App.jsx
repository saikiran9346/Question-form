import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';

import Question from './components/Question';
import SubmitView from './components/SubmitView';
import {
  createQuestion,
  deleteById,
  updateById,
  addChildTo,
} from './utils/questionUtils';

const STORAGE_KEY = 'nested-form-state';

// Load saved state from localStorage on first render
function loadFromStorage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [questions, setQuestions] = useState(loadFromStorage);
  const [submitted, setSubmitted] = useState(false);

  // Persist to localStorage on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
  }, [questions]);

  // dnd-kit sensors (mouse + keyboard)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // drag only starts after moving 8px — prevents conflict with clicks
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // ── Handlers ──────────────────────────────────────────
  const handleAddQuestion = () =>
    setQuestions((prev) => [...prev, createQuestion()]);

  const handleDelete = (id) =>
    setQuestions((prev) => deleteById(prev, id));

  const handleUpdate = (id, changes) =>
    setQuestions((prev) => updateById(prev, id, changes));

  const handleAddChild = (parentId) =>
    setQuestions((prev) => addChildTo(prev, parentId));

  // Reorder parent questions after a drag
  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    setQuestions((prev) => {
      const oldIndex = prev.findIndex((q) => q.id === active.id);
      const newIndex = prev.findIndex((q) => q.id === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  const handleClearAll = () => {
    if (window.confirm('Clear all questions? This cannot be undone.')) {
      setQuestions([]);
    }
  };

  // ── Submitted view ────────────────────────────────────
  if (submitted) {
    return (
      <SubmitView
        questions={questions}
        onBack={() => setSubmitted(false)}
      />
    );
  }

  // ── Builder view ──────────────────────────────────────
  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">Nested Form Builder</h1>
          <p className="app-subtitle">
            Build hierarchical question trees — supports unlimited nesting
          </p>
        </div>

        {questions.length > 0 && (
          <button className="btn-clear" onClick={handleClearAll} title="Clear all">
            Clear All
          </button>
        )}
      </header>

      <main className="app-main">
        {/* Drag-and-drop context wraps only parent questions */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={questions.map((q) => q.id)}
            strategy={verticalListSortingStrategy}
          >
            {questions.map((q, i) => (
              <Question
                key={q.id}
                question={q}
                number={`Q${i + 1}`}
                depth={0}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
                onAddChild={handleAddChild}
                isSortable={true}
              />
            ))}
          </SortableContext>
        </DndContext>

        {/* Empty state */}
        {questions.length === 0 && (
          <div className="empty-state">
            <span className="empty-icon">📋</span>
            <p>No questions yet.</p>
            <span className="empty-hint">Click "Add New Question" to get started.</span>
          </div>
        )}

        {/* Action buttons */}
        <div className="action-bar">
          <button className="btn btn-add" onClick={handleAddQuestion}>
            <span className="btn-icon">+</span> Add New Question
          </button>

          {questions.length > 0 && (
            <button className="btn btn-submit" onClick={() => setSubmitted(true)}>
              Submit Form <span className="btn-icon">→</span>
            </button>
          )}
        </div>

        {/* Auto-save indicator */}
        {questions.length > 0 && (
          <p className="autosave-hint">💾 Progress auto-saved to local storage</p>
        )}
      </main>
    </div>
  );
}