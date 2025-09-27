"use client";

import { useAuth } from "@/context/AuthContext";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CompatClient, Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";

interface ChatMessage {
    from: string;
    text: string;
}

export default function InterviewRoom() {
    const { token, user } = useAuth();
    const params = useParams();
    const sessionId = params.sessionId as string;

    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputText, setInputText] = useState("");
    const stompClient = useRef<CompatClient | null>(null);

    useEffect(() => {
        if (!token || !sessionId) return;

        const socket = new SockJS(`${process.env.NEXT_PUBLIC_WS_URL}`, [], {
            sessionId: () => {
                return sessionId;
            },
        });
        const client = Stomp.over(socket);
        stompClient.current = client;

        client.connect(
            {},
            () => {
                console.log("Connected to WebSocket");

                client.subscribe(`/topic/interview/${sessionId}`, (message) => {
                    const msg: ChatMessage = JSON.parse(message.body);
                    setMessages((prev) => [...prev, msg]);
                });

                client.send("/app/interview.start", {}, "");
            },
            (error: Error) => {
                console.error("WebSocket connection error:", error);
            }
        );

        return () => {
            if (stompClient.current?.connected) {
                stompClient.current.disconnect();
            }
        };
    }, [sessionId, token]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputText.trim() && stompClient.current?.connected) {
            const chatMessage: ChatMessage = {
                from: "user",
                text: inputText,
            };

            setMessages((prev) => [...prev, chatMessage]);
            stompClient.current.send(
                "/app/interview.sendMessage",
                {},
                JSON.stringify(chatMessage)
            );
            setInputText("");
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-900 text-white">
            <header className="p-4 bg-gray-800 text-center">
                <h1 className="text-xl font-bold">Interview Room</h1>
            </header>
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
                                <p className="text-sm">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            <footer className="p-4 bg-gray-800">
                <form className="flex" onSubmit={handleSendMessage}>
                    <input
                        type="text"
                        className="flex-1 p-2 bg-gray-700 rounded-l-md focus:outline-none"
                        placeholder="Type your answer..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 rounded-r-md"
                    >
                        Send
                    </button>
                </form>
            </footer>
        </div>
    );
}
