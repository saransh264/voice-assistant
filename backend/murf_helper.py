import os
import requests
import base64

def text_to_speech(text: str) -> str:
    """
    Takes a text string, sends it to the Murf Falcon API,
    and returns the generated audio as a base64 encoded string.
    """
    # Get the API key from environment variables
    api_key = os.environ.get("MURF_API_KEY")
    if not api_key or api_key == "your_murf_api_key_here":
        raise ValueError("MURF_API_KEY is not set or is invalid.")
        
    url = "https://api.murf.ai/v1/speech/generate"
    
    headers = {
        "Content-Type": "application/json",
        "api-key": api_key
    }
    
    payload = {
        "voiceId": "en-US-natalie",
        "text": text,
        "format": "MP3",
        "sampleRate": 44100,
        "channelType": "STEREO"
    }
    
    # Make the HTTP POST request to the Murf API
    response = requests.post(url, json=payload, headers=headers)
    
    if not response.ok:
        raise Exception(f"Murf API Error: {response.status_code} - {response.text}")
        
    # Standard Murf /generate API usually returns JSON with an 'audioFile' URL
    response_data = response.json()
    if 'audioFile' in response_data:
        # Download the actual audio file
        audio_url = response_data['audioFile']
        audio_response = requests.get(audio_url)
        if not audio_response.ok:
            raise Exception("Failed to download audio from Murf URL")
        audio_bytes = audio_response.content
    else:
        # If the endpoint streams back audio directly, fallback to this
        audio_bytes = response.content
        
    # Convert the raw audio bytes into a base64 encoded string
    base64_audio = base64.b64encode(audio_bytes).decode('utf-8')
    
    return base64_audio
