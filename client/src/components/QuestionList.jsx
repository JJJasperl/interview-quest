// client/src/components/QuestionList.jsx
import React, { useMemo, useState, useEffect, useRef } from "react";
import VoiceReader from "./VoiceReader";

/**
 * QuestionList Component - Renders a list of questions grouped by category
 * with text-to-speech functionality
 * 
 * @param {Object} props - Component props
 * @param {Array} props.questions - Array of question objects
 */
function QuestionList({ questions }) {
  // UI state
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isReading, setIsReading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speechRate, setSpeechRate] = useState(1);
  const [currentPosition, setCurrentPosition] = useState({
    categoryIndex: 0,
    questionIndex: 0,
  });
  
  // Refs for tracking state in event callbacks
  const isReadingRef = useRef(false);
  const isPausedRef = useRef(false);
  const currentUtteranceRef = useRef(null);
  const pausedPositionRef = useRef({ categoryIndex: 0, questionIndex: 0 });

  // Group questions by their categories
  const groupedQuestions = useMemo(() => {
    return questions.reduce((groups, question) => {
      const category = question.category || "General";
      if (!groups[category]) groups[category] = [];
      groups[category].push(question);
      return groups;
    }, {});
  }, [questions]);

  const categoryNames = Object.keys(groupedQuestions);

  // Format questions for clipboard copying
  const readableText = useMemo(() => {
    let text = "Generated Questions:\n\n";
    categoryNames.forEach((category) => {
      text += `${category}:\n`;
      groupedQuestions[category].forEach((q, idx) => {
        text += `${idx + 1}. ${q.question}\n\n`;
      });
    });
    return text;
  }, [groupedQuestions, categoryNames]);

  // Keep refs synchronized with state
  useEffect(() => {
    isReadingRef.current = isReading;
  }, [isReading]);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  /**
   * Speaks a question using text-to-speech
   * 
   * @param {number} categoryIndex - Index of the category
   * @param {number} questionIndex - Index of the question within the category
   * @param {number} rate - Speech rate (default: current speechRate)
   */
  const speakQuestion = (categoryIndex, questionIndex, rate = speechRate) => {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    // Reset paused state when starting a new question
    if (isPaused) {
      setIsPaused(false);
      isPausedRef.current = false;
    }
  
    // Validate category and question existence
    const category = categoryNames[categoryIndex];
    if (!category || !groupedQuestions[category][questionIndex]) {
      setIsReading(false);
      setIsPaused(false);
      isReadingRef.current = false;
      isPausedRef.current = false;
      setSelectedQuestion(null);
      return;
    }
  
    // Set current question and update UI
    const question = groupedQuestions[category][questionIndex].question;
    setCurrentPosition({ categoryIndex, questionIndex });
    pausedPositionRef.current = { categoryIndex, questionIndex };
    setSelectedQuestion(question);
    setIsReading(true);
    isReadingRef.current = true;
  
    // Configure and speak the utterance
    const utterance = new SpeechSynthesisUtterance(question);
    utterance.rate = rate;
    utterance.lang = "en-US";
    currentUtteranceRef.current = utterance;
  
    // Handle completion of speech
    utterance.onend = () => {
      // Only proceed if still in reading mode and not paused
      if (isReadingRef.current && !isPausedRef.current) {
        const nextQuestionIndex = questionIndex + 1;
        
        // Try next question in same category
        if (nextQuestionIndex < groupedQuestions[category].length) {
          speakQuestion(categoryIndex, nextQuestionIndex, rate);
        } else {
          // Try next category
          const nextCategoryIndex = categoryIndex + 1;
          if (nextCategoryIndex < categoryNames.length) {
            speakQuestion(nextCategoryIndex, 0, rate);
          } else {
            // No more questions, reset state
            setIsReading(false);
            setIsPaused(false);
            isReadingRef.current = false;
            isPausedRef.current = false;
            setSelectedQuestion(null);
          }
        }
      }
    };
  
    window.speechSynthesis.speak(utterance);
  };

  /**
   * Finds the position indices of a question in the grouped structure
   * 
   * @param {string} question - The question text to find
   * @returns {Object} Object with categoryIndex and questionIndex
   */
  const findQuestionPosition = (question) => {
    for (let c = 0; c < categoryNames.length; c++) {
      const category = categoryNames[c];
      for (let q = 0; q < groupedQuestions[category].length; q++) {
        if (groupedQuestions[category][q].question === question) {
          return { categoryIndex: c, questionIndex: q };
        }
      }
    }
    return { categoryIndex: 0, questionIndex: 0 };
  };

  /**
   * Starts reading all questions from the beginning
   */
  const startReadingAll = () => {
    setIsReading(true);
    isReadingRef.current = true;
    setIsPaused(false);
    isPausedRef.current = false;
    speakQuestion(0, 0, speechRate);
  };

  /**
   * Pauses the current reading
   */
  const pauseReading = () => {
    setIsPaused(true);
    isPausedRef.current = true;
    setIsReading(false);
    isReadingRef.current = false;
    
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
  };
  
  /**
   * Resumes reading from the last paused position
   */
  const resumeReading = () => {
    setIsPaused(false);
    isPausedRef.current = false;
    setIsReading(true);
    isReadingRef.current = true;
    
    speakQuestion(
      pausedPositionRef.current.categoryIndex, 
      pausedPositionRef.current.questionIndex,
      speechRate
    );
  };
  
  /**
   * Stops reading and resets all state
   */
  const stopReading = () => {
    window.speechSynthesis.cancel();
    setIsReading(false);
    isReadingRef.current = false;
    setIsPaused(false);
    isPausedRef.current = false;
    setSelectedQuestion(null);
    pausedPositionRef.current = { categoryIndex: 0, questionIndex: 0 };
  };
  
  /**
   * Handles speech rate changes
   * 
   * @param {number} rate - New speech rate value
   */
  const handleRateChange = (rate) => {
    setSpeechRate(rate);
    
    // If currently reading, restart with new rate
    if (isReading && !isPaused) {
      speakQuestion(
        currentPosition.categoryIndex,
        currentPosition.questionIndex,
        rate
      );
    }
  };

  // Cancel any ongoing speech synthesis when component unmounts
  useEffect(() => {
    return () => window.speechSynthesis.cancel();
  }, []);

  return (
    <div className="question-list-container">
      <div className="question-list-header">
        <h2 className="question-list-title">Generated Questions</h2>
        <div className="question-list-controls">
          <div className="voice-reader-wrapper">
            <VoiceReader
              onStartReading={startReadingAll}
              onPause={pauseReading}
              onResume={resumeReading}
              onStop={stopReading}
              isReading={isReading}
              isPaused={isPaused}
              speechRate={speechRate}
              onRateChange={handleRateChange}
            />
          </div>
          <div className="question-list-actions">
            <button
              className="action-button copy-button"
              onClick={() => {
                navigator.clipboard.writeText(readableText);
                alert("Questions copied to clipboard!");
              }}
            >
              <span className="button-icon">📋</span> Copy
            </button>
          </div>
        </div>
      </div>

      <div className="question-list-content">
        {categoryNames.map((category, cIndex) => (
          <div key={category} className="question-category-card">
            <h3 className="question-category-title">{category}</h3>
            <ol className="question-items">
              {groupedQuestions[category].map((q, qIndex) => (
                <li
                  key={qIndex}
                  className={`question-item ${
                    q.question === selectedQuestion ? "selected" : ""
                  }`}
                  onClick={() => {
                    const pos = findQuestionPosition(q.question);
                    speakQuestion(pos.categoryIndex, pos.questionIndex, speechRate);
                  }}
                >
                  <div className="question-text">{q.question}</div>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </div>
  );
}

export default QuestionList;