"use client";

import { useAuth } from "@/context/AuthContext";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { CompatClient, Stomp } from "@stomp/stompjs";
import { useTextToSpeech } from "@/hooks/ttsHook";
import { useSpeechRecognition } from "@/hooks/sttHook";
import { MicrophoneController } from "@/components/MicrophoneController";
import { Loader } from "@/components/Loader";

type ConnectionStatus = "DISCONNECTED" | "CONNECTING" | "CONNECTED" | "ERROR";
interface ChatMessage {
    from: string;
    text: string;
}

export default function InterviewRoom() {
    const { token } = useAuth();
    const params = useParams();
    const sessionId = params.sessionId as string;

    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [status, setStatus] = useState<ConnectionStatus>("CONNECTING");

    const stompClient = useRef<CompatClient | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const { speak, isSpeaking } = useTextToSpeech();
    const handleTranscriptReady = useCallback((transcript: string) => {
        if (transcript.trim() && stompClient.current?.connected) {
            const chatMessage: ChatMessage = { from: "user", text: transcript };
            setMessages(prev => [...prev, chatMessage]);
            stompClient.current.send("/app/interview.sendMessage", {}, JSON.stringify(chatMessage));
        }
    }, []);
    const { isListening, startListening } = useSpeechRecognition(handleTranscriptReady);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);


    useEffect(() => {
        let isConnected = false;

        const connect = async () => {
            if (isConnected || !token || !sessionId) return;

            try {
                const SockJs = (await import("sockjs-client")).default;

                const socket = new SockJs(`${process.env.NEXT_PUBLIC_WS_URL}?interviewSessionId=${sessionId}`);
                const client = Stomp.over(socket);
                stompClient.current = client;

                const onConnect = () => {
                    console.log("Connected to WebSocket");
                    isConnected = true;
                    setStatus("CONNECTED");

                    client.subscribe(`/topic/interview/${sessionId}`, (message) => {
                        const msg: ChatMessage = JSON.parse(message.body);
                        setMessages((prev) => [...prev, msg]);
                        speak(msg.text);
                    });

                    client.send("/app/interview.start", {}, "");
                };

                const onError = (error: string) => {
                    console.error("WebSocket error:", error);
                    setStatus("ERROR");
                };
            
                client.connect({}, onConnect, onError);
            } catch (error) {
                console.error("Connection error:", error);
                setStatus("ERROR");
            }
        };
        connect();

        return () => {
            console.log("Disconnecting...");
            if (stompClient.current?.connected) {
                stompClient.current.disconnect();
            }
        };
    }, [sessionId, token, speak]);

    const renderContent = () => {
        switch(status) {
            case "CONNECTING":
                return <Loader message="Connecting to interview room..." />;
            case "CONNECTED":
                return (
                    <>
                        <main className="flex-1 p-4 overflow-y-auto">
                            <div className="space-y-4">
                                {messages.map((msg, index) => (
                                    <div
                                        key={index}
                                        className={`flex ${
                                            msg.from === "Proctor"
                                                ? "justify-start"
                                                : "justify-end"
                                        }`}
                                    >
                                        <div
                                            className={`p-3 rounded-lg ${
                                                msg.from === "Proctor"
                                                    ? "bg-gray-700"
                                                    : "bg-indigo-600"
                                            }`}
                                        >
                                            <p className="text-base">{msg.text}</p>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef}/>
                            </div>
                        </main>
                        <footer className="p-4 bg-gray-800 flex flex-col items-center justify-center space-y-2">
                            <p className="text-sm text-gray-400">
                                {isSpeaking ? "Proctor is speaking..." : isListening ? "Listening..." : "Click the microphone to answer"}
                            </p>
                            <MicrophoneController isListening={isListening} startListening={startListening} />
                        </footer>
                    </>
                );
            case "ERROR":
                return (
                    <div className="flex flex-col items-center justify-center h-full text-red-400">
                        <h2 className="text-2xl font-bold">Connection Failed</h2>
                        <p>Could not connect to the interview room. Please try again later.</p>
                    </div>
                );
        }
    }
    return (
        <div className="flex flex-col h-screen bg-gray-900 text-white">
            <header className="p-4 bg-gray-800 text-center">
                <h1 className="text-xl font-bold">Interview Room</h1>
            </header>
            {renderContent()}
        </div>
    );
}
