import React, { useState } from 'react';
import './App.css';
import JobPostForm from './components/JobPostForm';
import QuestionList from './components/QuestionList';

function App() {
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Interview Quest</h1>
        <p>Generate insightful recruiter survey questions from job postings</p>
      </header>
      <main>
        <JobPostForm 
          setQuestions={setQuestions} 
          setIsLoading={setIsLoading} 
          setError={setError} 
        />
        {isLoading && <div className="loading">Generating questions...</div>}
        {error && <div className="error">Error: {error}</div>}
        {questions.length > 0 && <QuestionList questions={questions} />}
      </main>
      <footer>
        <p>© 2025 Interview Quest</p>
      </footer>
    </div>
  );
}

export default App;