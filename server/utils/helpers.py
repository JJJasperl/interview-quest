def sanitize_input(text):
    """
    Sanitize user input to prevent potential security issues.
    """
    if not text:
        return ""
    
    # Remove any potentially harmful characters or sequences
    # This is a simple example - in production you might want more robust sanitization
    sanitized = text.strip()
    
    return sanitized

def format_response(questions):
    """
    Ensure the response is properly formatted.
    """
    formatted = []
    
    for q in questions:
        if isinstance(q, dict):
            question = {
                "category": q.get("category", "General"),
                "question": q.get("question", "")
            }
            formatted.append(question)
    
    return formatted