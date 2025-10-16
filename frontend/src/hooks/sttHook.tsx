"use client";

import { useEffect, useRef, useState } from "react";

const SpeechRecognition =
    typeof window !== "undefined" &&
    ((window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition);

export const useSpeechRecognition = (
    onTranscriptReady: (transcript: string) => void
) => {
    const [isListening, setIsListening] = useState(false);
    const [interimTranscript, setInterimTranscript] = useState("");
    const recognition = useRef<any>(null);
    const finalTranscriptRef = useRef<string>("");

    useEffect(() => {
        if (!SpeechRecognition) {
            console.error("Speech Recognition not supported in this browser.");
            return;
        }

        recognition.current = new SpeechRecognition();
        recognition.current.continuous = true;
        recognition.current.interimResults = true;
        recognition.current.lang = "en-US";

        recognition.current.onresult = (event: any) => {
            let tempInterim = "";
            for (let i = event.resultIndex; i < event.results.length; i++) {
                if (event.results[i].isFinal) {
                    finalTranscriptRef.current +=
                        event.results[i][0].transcript;
                } else {
                    tempInterim += event.results[i][0].transcript;
                }
            }
            setInterimTranscript(tempInterim);
        };

        recognition.current.onerror = (event: any) => {
            console.error("Speech recognition error: ", event.error);
            setIsListening(false);
        };

        recognition.current.onend = () => {
            setIsListening(false);
        };

        return () => {
            recognition.current?.stop();
        };
    }, []);

    const startListening = () => {
        if (recognition.current && !isListening) {
            finalTranscriptRef.current = "";
            setInterimTranscript("");
            recognition.current.start();
            setIsListening(true);
        }
    };

    const stopListening = () => {
        if (recognition.current && isListening) {
            recognition.current.stop();
            setIsListening(false);
            onTranscriptReady(finalTranscriptRef.current);
        }
    };

    return { isListening, startListening, stopListening, interimTranscript };
};
