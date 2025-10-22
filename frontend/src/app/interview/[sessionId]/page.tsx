"use client";

import { useAuth } from "@/context/AuthContext";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { CompatClient, Stomp } from "@stomp/stompjs";
import { useTextToSpeech } from "@/hooks/ttsHook";
import { useSpeechRecognition } from "@/hooks/sttHook";
import { MicrophoneController } from "@/components/MicrophoneController";
import { Loader } from "@/components/Loader";

type ConnectionStatus = "CONNECTING" | "CONNECTED" | "ERROR";
interface ChatMessage {
    from: string;
    text: string;
}

export default function InterviewRoom() {
    const { token } = useAuth();
    const params = useParams();
    const router = useRouter();
    const sessionId = params.sessionId as string;

    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [status, setStatus] = useState<ConnectionStatus>("CONNECTING");

    const stompClient = useRef<CompatClient | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const isConnected = useRef<boolean>(false);

    const { speak, isSpeaking, cancel: cancelSpeech } = useTextToSpeech();
    const handleTranscriptReady = useCallback((transcript: string) => {
        if (transcript.trim() && stompClient.current?.connected) {
            const chatMessage: ChatMessage = { from: "user", text: transcript };
            setMessages((prev) => [...prev, chatMessage]);
            stompClient.current.send(
                "/app/interview.sendMessage",
                {},
                JSON.stringify(chatMessage)
            );
        }
    }, []);
    const { isListening, startListening, stopListening, interimTranscript } =
        useSpeechRecognition(handleTranscriptReady);

    const handleEndSession = async () => {
        cancelSpeech();
        stopListening?.();
        if (!sessionId || !token) return;

        console.log("Ending session...");
        stompClient.current?.disconnect();

        try {
            await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/feedback/${sessionId}/generate`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            router.push(`/interview/feedback/${sessionId}`);
        } catch (error) {
            console.error("Failed to trigger feedback generation:", error);
            alert("There was an error ending the session. Please try again.");
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, interimTranscript]);

    useEffect(() => {
        if (isConnected.current || !token || !sessionId) return;
        isConnected.current = true;

        import("sockjs-client").then((SockJSMoudle) => {
            const SockJs = SockJSMoudle.default;
            const socket = new SockJs(
                `${process.env.NEXT_PUBLIC_WS_URL}?interviewSessionId=${sessionId}`
            );
            const client = Stomp.over(socket);
            stompClient.current = client;

            const onConnect = () => {
                console.log("Connected to WebSocket");
                setStatus("CONNECTED");

                client.subscribe(`/topic/interview/${sessionId}`, (message) => {
                    const msg: ChatMessage = JSON.parse(message.body);
                    setMessages((prev) => [...prev, msg]);
                    speak(msg.text, startListening);
                });

                client.send("/app/interview.start", {}, "");
            };

            const onError = (error: string) => {
                console.error("WebSocket error:", error);
                setStatus("ERROR");
            };

            client.connect({}, onConnect, onError);
        });

    }, [sessionId, token, speak, cancelSpeech, startListening]);

    const renderContent = () => {
        switch (status) {
            case "CONNECTING":
                return <Loader message="Connecting to interview room..." />;
            case "CONNECTED":
                return (
                    <>
                        <main className="flex-1 p-4 overflow-y-auto overflow-x-hidden">
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
                                            <p className="text-base">
                                                {msg.text}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {isListening && interimTranscript && (
                                    <div className="flex justify-end">
                                        <div className="p-3 rounded-lg max-w-2xl bg-indigo-900 opacity-70">
                                            <p className="text-base italic">
                                                {interimTranscript}...
                                            </p>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        </main>
                        <footer className="p-4 bg-gray-800 flex flex-col items-center justify-center space-y-2">
                            <p className="text-sm text-gray-400">
                                {isSpeaking
                                    ? "Proctor is speaking..."
                                    : isListening
                                    ? "Listening..."
                                    : "Click the microphone to answer"}
                            </p>
                            <MicrophoneController
                                isListening={isListening}
                                startListening={startListening}
                                stopListening={stopListening}
                            />
                        </footer>
                    </>
                );
            case "ERROR":
                return (
                    <div className="flex flex-col items-center justify-center h-full text-red-400">
                        <h2 className="text-2xl font-bold">
                            Connection Failed
                        </h2>
                        <p>
                            Could not connect to the interview room. Please try
                            again later.
                        </p>
                    </div>
                );
        }
    };
    return (
        <div className="flex flex-col h-screen bg-gray-900 text-white">
            <header className="p-4 bg-gray-800 text-center flex justify-between items-center">
                <div></div>
                <h1 className="text-xl font-bold">Interview Room</h1>
                <button
                    onClick={handleEndSession}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition duration-300"
                >
                    End Session
                </button>
            </header>
            {renderContent()}
        </div>
    );
}
