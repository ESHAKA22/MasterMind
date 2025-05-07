import API from './api';

// Get all answers for a specific question
export const getAnswersByQuestionId = (questionId) => API.get(`/answers/question/${questionId}`);

// Create a new answer
export const createAnswer = (data) => API.post('/answers', data);

// Update an answer by ID
export const updateAnswer = (id, data) => API.put(`/answers/${id}`, data);

// Delete an answer by ID
export const deleteAnswer = (id) => API.delete(`/answers/${id}`);
