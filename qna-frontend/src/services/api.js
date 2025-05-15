import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080', // Explicitly point to backend
});

export const getQuestions = () => API.get('/api/questions');

export const getQuestionById = (id) => API.get(`/api/questions/${id}`);

export const getQuestionsByUserId = (userId) => API.get(`/api/questions/user/${userId}`);

export const createQuestion = (question, userId) =>
  API.post('/api/questions', question, { headers: { userId } });

export const updateQuestion = (id, question, userId) =>
  API.put(`/api/questions/${id}`, question, { headers: { userId } });

export const deleteQuestion = (id, userId) =>
  API.delete(`/api/questions/${id}`, { headers: { userId } });

export const getAnswersByQuestionId = (questionId) =>
  API.get(`/api/answers/question/${questionId}`);

export const getAnswerById = (id) => API.get(`/api/answers/${id}`);

export const getAnswersByUserId = (userId) => API.get(`/api/answers/user/${userId}`);

export const createAnswer = (answer, questionId, userId) =>
  API.post(`/api/answers/question/${questionId}`, answer, { headers: { userId } });

export const updateAnswer = (id, answer, userId) =>
  API.put(`/api/answers/${id}`, answer, { headers: { userId } });

export const deleteAnswer = (id, userId) =>
  API.delete(`/api/answers/${id}`, { headers: { userId } });

export const login = (credentials) => API.post('/api/users/login', credentials);

export const register = (userData) => API.post('/api/users/register', userData);