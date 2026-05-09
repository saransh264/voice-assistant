// Get DOM elements
const micBtn = document.getElementById('mic-btn');
const statusText = document.getElementById('status-text');
const userMessageContainer = document.getElementById('user-message-container');
const aiMessageContainer = document.getElementById('ai-message-container');
const questionText = document.getElementById('question-text');
const answerText = document.getElementById('answer-text');

// Backend API URL (Flask runs on port 5000 by default)
const API_URL = 'http://127.0.0.1:5000/ask';

// Check if the browser supports the Web Speech API
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
    statusText.textContent = "Your browser does not support Speech Recognition. Please use Chrome.";
    micBtn.disabled = true;
    micBtn.style.opacity = '0.5';
} else {
    // Initialize Speech Recognition
    const recognition = new SpeechRecognition();
    recognition.continuous = false; // Stop listening after user stops speaking
    recognition.lang = 'en-US';
    recognition.interimResults = false; // We only want the final recognized text

    let isListening = false;

    // Handle Mic Button Click
    micBtn.addEventListener('click', () => {
        if (isListening) {
            recognition.stop();
        } else {
            // Hide previous messages
            userMessageContainer.classList.add('hidden');
            aiMessageContainer.classList.add('hidden');
            
            try {
                recognition.start();
            } catch (e) {
                console.error("Recognition already started", e);
            }
        }
    });

    // Event: When speech recognition starts successfully
    recognition.onstart = () => {
        isListening = true;
        micBtn.classList.add('listening');
        statusText.textContent = "Listening...";
        statusText.className = "status-text"; // reset classes
    };

    // Event: When speech recognition successfully captures speech
    recognition.onresult = async (event) => {
        // Extract the recognized text
        const recognizedText = event.results[0][0].transcript;
        
        // Display what the user said
        questionText.textContent = recognizedText;
        userMessageContainer.classList.remove('hidden');
        userMessageContainer.style.position = 'relative';
        userMessageContainer.style.visibility = 'visible';

        // Update status and prepare to fetch AI response
        statusText.textContent = "Thinking...";
        statusText.classList.add('thinking');

        // Send the text to our Flask backend
        await fetchAIResponse(recognizedText);
    };

    // Event: When speech recognition ends (either stopped or finished)
    recognition.onend = () => {
        isListening = false;
        micBtn.classList.remove('listening');
        // If status is still "Listening...", reset it. (If it's "Thinking...", leave it)
        if (statusText.textContent === "Listening...") {
            statusText.textContent = "Click mic to speak";
        }
    };

    // Event: Error handling
    recognition.onerror = (event) => {
        console.error("Speech Recognition Error:", event.error);
        statusText.textContent = `Error: ${event.error}`;
        isListening = false;
        micBtn.classList.remove('listening');
    };
}

/**
 * Sends the question to the Flask backend and handles the response
 * @param {string} question - The recognized spoken text
 */
async function fetchAIResponse(question) {
    try {
        // Send POST request to /ask
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ question: question })
        });

        if (!response.ok) {
            throw new Error(`Server returned ${response.status}`);
        }

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error);
        }

        // Display the AI's text response
        answerText.textContent = data.answer;
        aiMessageContainer.classList.remove('hidden');
        aiMessageContainer.style.position = 'relative';
        aiMessageContainer.style.visibility = 'visible';
        
        statusText.textContent = "Speaking...";
        statusText.className = "status-text";

        // Play the returned base64 audio
        playBase64Audio(data.audio_base64);

    } catch (error) {
        console.error("Error fetching AI response:", error);
        statusText.textContent = "Error communicating with server.";
        statusText.className = "status-text";
    }
}

/**
 * Decodes a base64 string into a Blob and plays it using the Audio object
 * @param {string} base64String - The base64 encoded audio data
 */
function playBase64Audio(base64String) {
    try {
        // Convert base64 to binary string
        const binaryString = window.atob(base64String);
        
        // Convert binary string to array buffer
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        
        // Create a Blob from the bytes
        const blob = new Blob([bytes], { type: 'audio/mp3' }); // Adjust type if Murf returns wav
        
        // Create an object URL from the Blob
        const audioUrl = URL.createObjectURL(blob);
        
        // Create an Audio element and play it
        const audio = new Audio(audioUrl);
        
        audio.onended = () => {
            statusText.textContent = "Click mic to speak";
            // Clean up the URL object after playing
            URL.revokeObjectURL(audioUrl);
        };
        
        // Auto-play the audio
        audio.play().catch(e => {
            console.error("Auto-play blocked or failed:", e);
            statusText.textContent = "Audio ready (Click to play might be needed depending on browser)";
        });

    } catch (error) {
        console.error("Error playing audio:", error);
        statusText.textContent = "Error playing audio.";
    }
}
