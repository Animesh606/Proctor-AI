"use client";

import { useEffect, useRef, useState } from "react";

const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

export const useSpeechRecognition = (onTranscriptReady: (transcript: string) => void) => {
    const [isListening, setIsListening] = useState(false);
    const recognition = useRef<any>(null);

    useEffect(() => {
        if(!SpeechRecognition) {
            console.error("Speech Recognition not supported in this browser.");
            return;
        }

        recognition.current = new SpeechRecognition();
        recognition.current.continuous = true;
        recognition.current.interimResults = true;
        recognition.current.lang = 'en-US';

        recognition.current.onresult = (event: any) => {
            const transcript = Array.from(event.results)
                .map((result: any) => result[0])
                .map((result) => result.transcript)
                .join('');

            if (event.results[event.results.length - 1].isFinal) {
                onTranscriptReady(transcript);
                stopListening();
            }
        };

        recognition.current.orerror = (event: any) => {
            console.error('Speech recognition error: ', event.error);
            stopListening();
        };

        return () => {
            if(recognition.current)
                recognition.current.stop();
        }
    }, [onTranscriptReady]);

    const startListening = () => {
        if (recognition.current && !isListening) {
            recognition.current.start();
            setIsListening(true);
        }
    }

    const stopListening = () => {
        if(recognition.current && isListening) {
            recognition.current.stop();
            setIsListening(false);
        }
    };

    return { isListening, startListening };
}