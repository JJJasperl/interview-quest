from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from services.openai_service import generate_questions_with_openai
from services.question_processor import categorize_questions

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

@app.route('/api/generate', methods=['POST'])
def generate_questions():
    data = request.json
    job_post = data.get('jobPost', '')
    
    if not job_post:
        return jsonify({'error': 'Job post is required'}), 400
    
    try:
        # Generate questions using OpenAI
        raw_questions = generate_questions_with_openai(job_post)
        
        # Process and categorize questions
        categorized_questions = categorize_questions(raw_questions)
        
        return jsonify({'questions': categorized_questions})
    
    except Exception as e:
        app.logger.error(f"Error generating questions: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)