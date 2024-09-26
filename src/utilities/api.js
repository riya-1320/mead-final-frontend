// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://13.202.225.45:5000/api/components', // Replace with your API base URL
});

export default api;
