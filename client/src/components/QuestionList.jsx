import React from 'react';

function QuestionList({ questions }) {
  // Group questions by category
  const groupedQuestions = questions.reduce((groups, question) => {
    const category = question.category || 'General';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(question);
    return groups;
  }, {});

  return (
    <div className="question-list">
      <h2>Generated Questions</h2>
      
      {Object.entries(groupedQuestions).map(([category, categoryQuestions]) => (
        <div key={category} className="question-category">
          <h3>{category}</h3>
          <ul>
            {categoryQuestions.map((q, index) => (
              <li key={index}>
                {q.question}
              </li>
            ))}
          </ul>
        </div>
      ))}
      
      <div className="question-actions">
        <button onClick={() => window.print()}>Print Questions</button>
      </div>
    </div>
  );
}

export default QuestionList;