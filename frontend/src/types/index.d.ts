// Auth related interfaces

export interface RegisterData {
    username?: string;
    email?: string;
    password?: string;
}

export interface LoginData {
    email?: string;
    password?: string;
}

export interface AuthResponse {
    token: string;
}

export interface User {
    sub: string;
    username: string;
    iat: number;
    exp: number;
}

export interface AuthContextType {
    token: string | null;
    user: User | null;
    login: (token: string) => void;
    logout: () => void;
}

// Speech Recognition related interfaces

interface SpeechRecognitionResult {
    isFinal: boolean;
    [index: number]: {
        transcript: string;
        confidence: number;
    };
}

export interface SpeechRecognitionEvent extends Event {
    resultIndex: number;
    results: SpeechRecognitionResult[];
}

export interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;

    lang: string;
    start(): void;
    stop(): void;
    abort(): void;
    onresult: (event: SpeechRecognitionEvent) => void;
    onerror: (event: Event) => void;
    onend: () => void;
}

declare global {
    interface Window {
        SpeechRecognition: typeof SpeechRecognition;
        webkitSpeechRecognition: typeof SpeechRecognition;
    }
}