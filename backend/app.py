import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

from groq_helper import get_answer
from murf_helper import text_to_speech

# Load environment variables from the .env file
load_dotenv()

# Initialize the Flask application
app = Flask(__name__)

# Enable CORS (Cross-Origin Resource Sharing) for all routes
# This allows our frontend to make requests to this backend
CORS(app)

@app.route('/ask', methods=['POST'])
def ask():
    """
    This route receives a question from the frontend, gets an answer from Groq,
    converts the answer to speech using Murf, and returns both text and audio.
    """
    # 1. Parse the incoming JSON request
    data = request.get_json()
    
    # Check if the 'question' field is in the request data
    if not data or 'question' not in data:
        return jsonify({"error": "No question provided"}), 400
        
    question = data['question']
    
    try:
        # 2. Call the Groq helper to get the AI's text response
        print(f"Getting answer for: {question}")
        answer_text = get_answer(question)
        
        # 3. Call the Murf helper to convert the text response to audio
        print("Converting answer to speech...")
        audio_base64 = text_to_speech(answer_text)
        
        # 4. Return the text answer and base64 audio to the frontend
        return jsonify({
            "answer": answer_text,
            "audio_base64": audio_base64
        })
        
    except Exception as e:
        # Handle any errors gracefully
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Start the Flask development server on port 5000
    app.run(debug=True, port=5000)
