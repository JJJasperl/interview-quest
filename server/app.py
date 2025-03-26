from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

@app.route('/api/generate', methods=['POST'])
def generate_questions():
    data = request.json
    job_post = data.get('jobPost', '')
    
    # TODO: Implement OpenAI integration
    
    # Placeholder response
    questions = [
        {'category': 'Role Clarification', 'question': 'What are the day-to-day responsibilities for this position?'},
        {'category': 'Team Structure', 'question': 'How is the team currently structured?'}
    ]
    
    return jsonify({'questions': questions})

if __name__ == '__main__':
    app.run(debug=True)
