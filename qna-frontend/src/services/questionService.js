import API from './api';

// Get all questions
export const getAllQuestions = () => API.get('/questions');

// Get a single question by ID
export const getQuestionById = (id) => API.get(`/questions/${id}`);

// Create a new question
export const createQuestion = (data) => API.post('/questions', data);

// Update a question by ID
export const updateQuestion = (id, data) => API.put(`/questions/${id}`, data);

// Delete a question by ID
export const deleteQuestion = (id) => API.delete(`/questions/${id}`);
