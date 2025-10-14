"use client";

import { useCallback, useState } from "react";

export const useTextToSpeech = () => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    
    const speak = useCallback((text: string) => {
        if(typeof window === "undefined" || !window.speechSynthesis) {
            console.error("Speech Synthesis not supported in this browser.");
            return;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
    }, []);

    return { isSpeaking, speak };
}