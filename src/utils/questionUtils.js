// Generate a unique ID without any library
export const generateId = () =>
  Math.random().toString(36).slice(2) + Date.now().toString(36);

// Create a blank question object
export const createQuestion = () => ({
  id: generateId(),
  text: '',
  type: 'short',      // 'short' | 'truefalse'
  answer: '',         // '' | 'true' | 'false'
  children: [],
});

// Recursively delete a question by id
export const deleteById = (questions, id) =>
  questions
    .filter((q) => q.id !== id)
    .map((q) => ({ ...q, children: deleteById(q.children, id) }));

// Recursively update a question's fields by id
export const updateById = (questions, id, changes) =>
  questions.map((q) => {
    if (q.id === id) return { ...q, ...changes };
    return { ...q, children: updateById(q.children, id, changes) };
  });

// Add a new child question to a parent identified by id
export const addChildTo = (questions, parentId) =>
  questions.map((q) => {
    if (q.id === parentId)
      return { ...q, children: [...q.children, createQuestion()] };
    return { ...q, children: addChildTo(q.children, parentId) };
  });