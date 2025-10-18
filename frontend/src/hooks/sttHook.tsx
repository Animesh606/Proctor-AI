"use client";

import { useEffect, useRef, useState } from "react";
import {
    SpeechRecognition as SpeechRecognitionAPI,
    SpeechRecognitionEvent,
} from "@/types";

const SpeechRecognition =
    typeof window !== "undefined" &&
    (window.SpeechRecognition || window.webkitSpeechRecognition);

export const useSpeechRecognition = (
    onTranscriptReady: (transcript: string) => void
) => {
    const [isListening, setIsListening] = useState(false);
    const [interimTranscript, setInterimTranscript] = useState("");
    const recognition = useRef<SpeechRecognitionAPI | null>(null);
    const finalTranscriptRef = useRef<string>("");

    useEffect(() => {
        if (!SpeechRecognition) {
            console.error("Speech Recognition not supported in this browser.");
            return;
        }

        recognition.current = new SpeechRecognition();
        if (recognition.current) {
            recognition.current.continuous = true;
            recognition.current.interimResults = true;
            recognition.current.lang = "en-US";

            recognition.current.onresult = (event: SpeechRecognitionEvent) => {
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

            recognition.current.onerror = (event: Event) => {
                console.error("Speech recognition error: ", event);
                setIsListening(false);
            };

            recognition.current.onend = () => {
                setIsListening(false);
            };
        }

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
