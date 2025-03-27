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

export const extractJobDetails = async (jobPost) => {
  try {
    const response = await fetch(`${API_URL}/extract-job-details`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ jobPost }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to extract job details');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error extracting job details:', error);
    return { company: '', jobTitle: '' };
  }
};