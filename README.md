# AI Interview Question Generator

## Overview

The AI Interview Question Generator is a web application designed to assist recruiters and hiring managers in preparing for candidate interviews. By analyzing job descriptions, the application intelligently generates relevant, context-based interview questions to ensure comprehensive candidate evaluation.

## Features

### Core Functionality
- **Job Description Analysis**: Upload or paste job descriptions to have them automatically analyzed
- **Automated Question Generation**: Instantly create tailored interview questions based on job requirements
- **Category Organization**: Questions are automatically organized into intuitive categories:
  - Role Clarification
  - Skills Assessment
  - Team Structure
  - Success Criteria
  - Company Culture
  - Growth Opportunities



## Tech Stack

### Frontend
- **React**
- **CSS/SCSS**:
- **Web Speech API**

### Backend
- **Python/Flask**
- **OpenAI API (GPT-4o-mini)**

## Project Structure
```
interview-quest/
├── client/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── utils/
│       ├── App.css
│       ├── App.js
│       ├── index.css
│       └── index.js
│
└── server/
    ├── services/
    ├── utils/
    ├── venv/
    └── .env
```
## How to Use

1. **Enter Job Description**
   - Paste a job description into the text area

2. **Generate Questions**
   - Click "Generate Questions" button to start the AI analysis process
   - Wait for the processing to complete

3. **Review and Use Questions**
   - Browse questions organized by category
   - Click on questions to hear them read aloud
   - Use voice controls to play, pause, or adjust reading speed
   - Copy questions to clipboard for use in interview documents

## Future Enhancements

- User accounts and question history
- Customizable question categories
- Collaborative interview prep tools
- Integration with ATS (Applicant Tracking Systems)
- PDF export functionality
- Multilingual support


## License

This project is licensed under the MIT License - see the LICENSE file for details.
