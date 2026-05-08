import React from 'react';

const DEPTH_COLORS = ['#818cf8', '#34d399', '#fb923c', '#f472b6', '#60a5fa'];

// Recursive component that renders a single question + its children
function SubmittedQuestion({ question, number, depth }) {
  const accentColor = DEPTH_COLORS[depth % DEPTH_COLORS.length];

  return (
    <div
      className="submit-question"
      style={{ '--q-accent': accentColor }}
    >
      <div className="submit-question-header">
        <span className="submit-number">{number}</span>
        <span className="submit-text">
          {question.text.trim() || <em className="no-text">(No question text entered)</em>}
        </span>
        <span className="submit-type">
          {question.type === 'short' ? 'Short Answer' : 'True / False'}
        </span>
      </div>

      {question.type === 'truefalse' && question.answer && (
        <div className="submit-answer">
          Answer:{' '}
          <strong className={question.answer === 'true' ? 'answer-true' : 'answer-false'}>
            {question.answer.charAt(0).toUpperCase() + question.answer.slice(1)}
          </strong>
        </div>
      )}

      {question.children.length > 0 && (
        <div className="submit-children">
          {question.children.map((child, i) => (
            <SubmittedQuestion
              key={child.id}
              question={child}
              number={`${number}.${i + 1}`}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Count total questions recursively (for the summary badge)
function countAll(questions) {
  return questions.reduce(
    (acc, q) => acc + 1 + countAll(q.children),
    0
  );
}

function SubmitView({ questions, onBack }) {
  const total = countAll(questions);

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="submit-badge">✓ Submitted</div>
          <h1 className="app-title">Form Review</h1>
          <p className="app-subtitle">
            {total} question{total !== 1 ? 's' : ''} in hierarchical view
          </p>
        </div>
      </header>

      <main className="app-main">
        <div className="submit-container">
          {questions.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📭</span>
              <p>No questions were submitted.</p>
            </div>
          ) : (
            questions.map((q, i) => (
              <SubmittedQuestion
                key={q.id}
                question={q}
                number={`Q${i + 1}`}
                depth={0}
              />
            ))
          )}
        </div>

        <div className="action-bar">
          <button className="btn btn-back" onClick={onBack}>
            ← Back to Edit
          </button>
        </div>
      </main>
    </div>
  );
}

export default SubmitView;