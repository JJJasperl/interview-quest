import os
import json
import openai
from openai import OpenAI


# Initialize OpenAI client
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

def generate_questions_with_openai(job_post):
    """Generate interview questions based on job posting using OpenAI."""
    try:
        # System message to guide the AI
        system_message = """
        You are an expert AI recruiter assistant. Your task is to analyze a job posting 
        and generate insightful questions that a recruiter should ask to gather more context 
        about the position. Focus on uncovering details not explicitly mentioned in the job post.
        
        Create questions in these categories:
        1. Role Clarification - Questions about specific responsibilities and day-to-day tasks
        2. Skills Assessment - Questions about technical or soft skills requirements and priorities
        3. Team Structure - Questions about the team composition, reporting lines, and dynamics
        4. Success Criteria - Questions about how performance will be measured
        5. Company Culture - Questions about work environment and values
        6. Growth Opportunities - Questions about career progression and development
        
        For each question, return both the question and its category. The response should be structured 
        as a JSON array of objects, each with 'category' and 'question' fields.
        """
        
        # User message with the job post
        user_message = f"Please analyze this job posting and generate relevant questions:\n\n{job_post}"
        
        # Make the API call
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": user_message}
            ],
            temperature=0.7,
            max_tokens=1500
        )
        
        # Parse the response
        content = response.choices[0].message.content
        questions_data = json.loads(content)
        
        # Ensure we have the expected structure
        if 'questions' in questions_data:
            return questions_data['questions']
        else:
            return questions_data.get('data', [])  # Fallback
            
    except Exception as e:
        print(f"OpenAI API error: {str(e)}")
        raise Exception(f"Failed to generate questions: {str(e)}")