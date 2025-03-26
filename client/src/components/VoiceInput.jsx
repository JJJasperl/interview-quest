// client/src/components/VoiceInput.jsx
import React, { useState, useEffect } from 'react';

function VoiceInput({ onTextCaptured, placeholder }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    // Initialize speech recognition
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onresult = (event) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            currentTranscript += event.results[i][0].transcript + ' ';
          }
        }
        
        if (currentTranscript) {
          setTranscript(prev => prev + currentTranscript);
          onTextCaptured(prev => prev + currentTranscript);
        }
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
    } else {
      console.error('Speech recognition not supported in this browser');
    }
    
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [onTextCaptured]);

  const toggleListening = () => {
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      try {
        recognition.start();
        setIsListening(true);
      } catch (error) {
        console.error('Speech recognition error', error);
      }
    }
  };

  return (
    <div className="voice-input">
      <button 
        type="button" 
        onClick={toggleListening} 
        className={`voice-button ${isListening ? 'listening' : ''}`}
      >
        {isListening ? 'Stop Dictation' : 'Start Dictation'}
      </button>
      {isListening && (
        <div className="recording-indicator">
          Listening...
        </div>
      )}
    </div>
  );
}

export default VoiceInput;