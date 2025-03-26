import React, { useState } from 'react';
import { generateQuestions } from '../services/api';

function JobPostForm({ setQuestions, setIsLoading, setError }) {
  const [jobPost, setJobPost] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!jobPost.trim()) {
      setError('Please enter a job posting');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const data = await generateQuestions(jobPost);
      setQuestions(data.questions);
    } catch (err) {
      console.error('Error generating questions:', err);
      setError(err.response?.data?.message || 'Failed to generate questions');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="job-post-form">
      <h2>Enter Job Posting</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={jobPost}
          onChange={(e) => setJobPost(e.target.value)}
          placeholder="Paste the job posting here..."
          rows={10}
          required
        />
        <button type="submit">Generate Questions</button>
      </form>
    </div>
  );
}

export default JobPostForm;