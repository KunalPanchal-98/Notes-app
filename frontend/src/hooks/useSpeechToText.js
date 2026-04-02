import { useEffect, useRef, useState } from "react";

const SpeechRecognition =
  typeof window !== "undefined" &&
  (window.SpeechRecognition || window.webkitSpeechRecognition);

export const useSpeechToText = () => {
  const [listening, setListening] = useState(false);
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!SpeechRecognition) {
      setError("Speech recognition not supported in this browser.");
      return;
    }
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = "en-US";

    recognitionRef.current.onstart = () => setListening(true);
    recognitionRef.current.onend = () => setListening(false);
    recognitionRef.current.onerror = (evt) => {
      setError(evt.error || "Mic issue");
      setListening(false);
    };
  }, []);

  const listenOnce = () =>
    new Promise((resolve, reject) => {
      if (!recognitionRef.current) {
        setError("Speech recognition unavailable.");
        return reject(new Error("no recognition"));
      }
      recognitionRef.current.onresult = (evt) => {
        const transcript = evt.results[0][0].transcript;
        resolve(transcript);
      };
      recognitionRef.current.start();
    });

  return { listening, error, listenOnce };
};
