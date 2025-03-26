import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const generateQuestions = async (jobPost) => {
  try {
    const response = await axios.post(`${API_URL}/generate`, { jobPost });
    return response.data;
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
};