import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [flaskData, setFlaskData] = useState(null);
  const [transcribeData, setTranscribeData] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [serverResponse, setServerResponse] = useState(null);

  useEffect(() => {
    async function fetchFlaskData() {
      const result = await axios('http://localhost:5000/test-flask');
      setFlaskData(result.data);
    }
    fetchFlaskData();
  }, []);

  useEffect(() => {
    async function fetchTranscribeData() {
      try {
        const response = await axios.post('http://localhost:5000/transcribe', {
          transcript: transcript,
        });
        setTranscribeData(response.data);
      } catch (error) {
        console.error('Error processing message:', error);
      }
    }
    fetchTranscribeData();
  }, [transcript]);

  const startTranscription = () => {
    setIsTranscribing(true);
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onresult = event => {
      const speechToText = event.results[0][0].transcript;
      setTranscript(speechToText);
    };
    recognition.start();
  };

  const stopTranscription = () => {
    setIsTranscribing(false);
  };

  const sendTranscriptToServer = (transcript) => {
    axios.post("http://localhost:5000/generate_phrases", {
      transcript: transcript,
    })
    .then((response) => {
      setServerResponse(response.data);
    })
    .catch((error) => {
      console.error("Error sending transcript:", error);
    });
  };

  useEffect(() => {
    if (transcript !== '') {
      sendTranscriptToServer(transcript);
    }
  }, [transcript]);

  return (
    <div>
      <h1>Crusty White Dog</h1>
      <button
        onClick={startTranscription}
        disabled={isTranscribing}
        className="explore-button rounded-full"
      >
        Start Transcription
      </button>
      <button
        onClick={stopTranscription}
        disabled={!isTranscribing}
        className="explore-button rounded-full"
      >
        Stop Transcription
      </button>
      <p>Transcription: {transcribeData ? transcribeData.transcript : 'Loading...'}</p>
      {transcript.includes("paw") ? (
        <img src="dog-poses/paw.jpg" alt="Paw" className="dog-image" />
      ) : transcript.includes("bark") ? (
        <img src="dog-poses/bark.jpg" alt="Bark" className="dog-image" />
      ) : transcript.includes("sit") ? (
        <img src="dog-poses/sit.jpg" alt="Sit" className="dog-image" />    
      ) : (
        <img src="dog-poses/default.jpg" alt="Dog" className="dog-image" />
      )}
    </div>
  );
}

export default App;