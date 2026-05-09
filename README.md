# Voice Search Assistant

A beginner-friendly full-stack web application that allows users to ask questions using their voice and hear the AI's response spoken back to them.

## Tech Stack
- **Frontend**: Vanilla HTML, CSS, JavaScript
- **Backend**: Python, Flask
- **Speech-to-Text**: Web Speech API (built into Chrome)
- **AI Model**: Groq API (llama-3.3-70b-versatile)
- **Text-to-Speech**: Murf API

## Setup Instructions

1. **Install Python dependencies:**
   Navigate to the `backend` folder and run:
   ```bash
   pip install -r requirements.txt
   ```

2. **Add API Keys:**
   Open `backend/.env` and add your Groq and Murf API keys:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   MURF_API_KEY=your_murf_api_key_here
   ```

## How to Run

1. **Start the Backend Server:**
   From the `backend` directory, run:
   ```bash
   python app.py
   ```
   The server will run on `http://localhost:5000`.

2. **Open the Frontend:**
   Open the `frontend/index.html` file in Google Chrome.

3. **Use the Assistant:**
   Click the large microphone button, speak your question, and wait for the AI to respond!

## Screenshot
*(Add your screenshot here)*
