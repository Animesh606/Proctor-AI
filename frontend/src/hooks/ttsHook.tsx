"use client";

import { useCallback, useEffect, useState } from "react";

export const useTextToSpeech = () => {
    const [isSpeaking, setIsSpeaking] = useState(false);

    const speak = useCallback((text: string, onEndCallback?: () => void) => {
        if (typeof window === "undefined" || !window.speechSynthesis) {
            console.error("Speech Synthesis not supported in this browser.");
            return;
        }

        window.speechSynthesis.cancel(); // Cancel any ongoing speech

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => {
            setIsSpeaking(false);
            onEndCallback?.();
        };
        utterance.onerror = (e) => {
            console.error("Speech Synthesis error:", e);
            setIsSpeaking(false);
        };

        window.speechSynthesis.speak(utterance);
    }, []);

    const cancel = useCallback(() => {
        if (typeof window === "undefined" || !window.speechSynthesis) {
            console.error("Speech Synthesis not supported in this browser.");
            return;
        }

        window.speechSynthesis.cancel(); // Cancel any ongoing speech
    }, []);

    useEffect(() => {
        window.addEventListener("beforeunload", cancel);
        return () => {
            window.removeEventListener("beforeunload", cancel);
        };
    }, [cancel]);

    return { isSpeaking, speak, cancel };
};
