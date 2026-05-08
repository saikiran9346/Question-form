import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Each depth level gets a distinct accent colour
const DEPTH_COLORS = ['#818cf8', '#34d399', '#fb923c', '#f472b6', '#60a5fa'];

function Question({ question, number, depth, onDelete, onUpdate, onAddChild, isSortable }) {
  // useSortable is only active for top-level (parent) questions
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id, disabled: !isSortable });

  const dragStyle = isSortable
    ? { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 }
    : {};

  const accentColor = DEPTH_COLORS[depth % DEPTH_COLORS.length];

  // Child questions only appear when type is True/False AND answer is "true"
  const showAddChild = question.type === 'truefalse' && question.answer === 'true';

  // When type changes, wipe answer + children to avoid stale state
  const handleTypeChange = (e) => {
    onUpdate(question.id, { type: e.target.value, answer: '', children: [] });
  };

  return (
    <div
      ref={isSortable ? setNodeRef : undefined}
      style={{ ...dragStyle, '--q-accent': accentColor }}
      className={`question-card ${isDragging ? 'is-dragging' : ''}`}
    >
      {/* ── Header: drag handle · number badge · delete ── */}
      <div className="question-header">
        {isSortable && (
          <button
            className="drag-handle"
            title="Drag to reorder"
            {...attributes}
            {...listeners}
          >
            ⠿
          </button>
        )}

        <span className="question-number">{number}</span>

        <button
          className="btn-delete"
          title="Delete question"
          onClick={() => onDelete(question.id)}
        >
          ✕
        </button>
      </div>

      {/* ── Body: text input + type selector ── */}
      <div className="question-body">
        <input
          className="question-input"
          type="text"
          placeholder="Type your question here…"
          value={question.text}
          onChange={(e) => onUpdate(question.id, { text: e.target.value })}
        />

        <select
          className="question-select"
          value={question.type}
          onChange={handleTypeChange}
        >
          <option value="short">Short Answer</option>
          <option value="truefalse">True / False</option>
        </select>
      </div>

      {/* ── Answer row (only for True/False questions) ── */}
      {question.type === 'truefalse' && (
        <div className="answer-row">
          <span className="answer-label">Answer:</span>

          <label className="radio-label">
            <input
              type="radio"
              name={`answer-${question.id}`}
              value="true"
              checked={question.answer === 'true'}
              onChange={() => onUpdate(question.id, { answer: 'true' })}
            />
            True
          </label>

          <label className="radio-label">
            <input
              type="radio"
              name={`answer-${question.id}`}
              value="false"
              checked={question.answer === 'false'}
              onChange={() => onUpdate(question.id, { answer: 'false' })}
            />
            False
          </label>
        </div>
      )}

      {/* ── Nested children ── */}
      {question.children.length > 0 && (
        <div className="children-container">
          {question.children.map((child, i) => (
            <Question
              key={child.id}
              question={child}
              number={`${number}.${i + 1}`}
              depth={depth + 1}
              onDelete={onDelete}
              onUpdate={onUpdate}
              onAddChild={onAddChild}
              isSortable={false}
            />
          ))}
        </div>
      )}

      {/* ── Add sub-question button (only when answer is True) ── */}
      {showAddChild && (
        <button
          className="btn-add-child"
          style={{ borderColor: accentColor, color: accentColor }}
          onClick={() => onAddChild(question.id)}
        >
          + Add Sub-question
        </button>
      )}
    </div>
  );
}

export default Question;