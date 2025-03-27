// client/src/App.jsx

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import JobPostForm from './components/JobPostForm';
import QuestionList from './components/QuestionList';
import RecentSearches from './components/RecentSearches';
import SearchHistory from './pages/SearchHistory';
import { saveSearch } from './utils/cache';

// **Main Application Component**
// This component sets up the routing for the application.
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/history" element={<SearchHistory />} />
      </Routes>
    </Router>
  );
}

// **Home Page Component**
// Handles job posting input, question generation, and recent search management.
function HomePage() {
  const [questions, setQuestions] = useState([]); // Stores generated interview questions
  const [isLoading, setIsLoading] = useState(false); // Manages loading state
  const [error, setError] = useState(null); // Stores any error messages
  const [currentSearch, setCurrentSearch] = useState(null); // Tracks the current search selection
  const [searchUpdateTrigger, setSearchUpdateTrigger] = useState(0); // Triggers recent searches refresh
  const location = useLocation(); // Gets the current URL location

  // **Effect: Handle navigation state updates**
  // If the user navigates from the history page, prefill the search details.
  useEffect(() => {
    if (location.state?.selectedSearch) {
      setCurrentSearch(location.state.selectedSearch);
      setQuestions(location.state.selectedSearch.questions);
      // Clear the location state to prevent reloading the same data on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // **Handle New Question Generation**
  // Updates the UI with newly generated questions and stores the search entry.
  const handleQuestionsGenerated = (questions, formData) => {
    console.log("Questions generated with form data:", formData);
    
    // Update the state with the new set of questions
    setQuestions(questions);
    
    // Construct search data object for caching and history tracking
    const searchData = {
      company: formData?.company || "Unknown Company",
      jobTitle: formData?.jobTitle || "Unknown Position",
      jobPost: formData?.jobPost || "",
      questions: questions,
      timestamp: new Date().toISOString()
    };
    
    // Save search data to cache and trigger UI update for recent searches
    saveSearch(searchData);
    setSearchUpdateTrigger(prev => prev + 1);
  };
  
  // **Handle Selection of a Recent Search**
  // Updates the question list based on a previously saved search.
  const handleSelectRecentSearch = (searchData) => {
    setQuestions(searchData.questions);
    setCurrentSearch(searchData);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Interview Quest</h1>
        <p>Generate insightful recruiter survey questions from job postings</p>
      </header>
      
      <main>
        {/* Recent Searches Section */}
        <RecentSearches 
          onSelectSearch={handleSelectRecentSearch} 
          searchUpdateTrigger={searchUpdateTrigger}
        />
        
        {/* Job Post Form for Generating Questions */}
        <JobPostForm 
          setQuestions={handleQuestionsGenerated}
          setIsLoading={setIsLoading} 
          setError={setError}
          currentSearch={currentSearch}
        />
        
        {/* Loading and Error Messages */}
        {isLoading && <div className="loading">Generating questions...</div>}
        {error && <div className="error">Error: {error}</div>}
        
        {/* Display Generated Questions */}
        {questions.length > 0 && <QuestionList questions={questions} />}
      </main>
      
      <footer>
        <p>© 2025 Interview Quest</p>
      </footer>
    </div>
  );
}

export default App;