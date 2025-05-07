// src/services/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: '', // Leave this empty if using proxy
});

export default API;
