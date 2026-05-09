import os
from groq import Groq

def get_answer(question: str) -> str:
    """
    Takes a question string, sends it to the Groq API,
    and returns the AI's response as a string.
    """
    # Get the API key from environment variables
    api_key = os.environ.get("GROQ_API_KEY")
    if not api_key or api_key == "your_groq_api_key_here":
        raise ValueError("GROQ_API_KEY is not set or is invalid.")
        
    # Initialize the Groq client
    client = Groq(api_key=api_key)
    
    # Create the chat completion request
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": "You are a helpful voice assistant. Keep answers concise and conversational, ideally 2-3 sentences."
            },
            {
                "role": "user",
                "content": question,
            }
        ],
        model="llama-3.3-70b-versatile",
    )
    
    # Extract and return the text content from the AI's response
    return chat_completion.choices[0].message.content
