"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [message, setMessage] = useState('Loading...');
  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/hello');
        if (!response.ok) {
          throw new Error('HTTP error! status: ' + response.status);
        }
        const data = await response.json();
        setMessage(data.message);
      } catch (error) {
        console.error('Error fetching message: ', error);
        setMessage('Failed to connect to backend');
      }
    };
    fetchMessage();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Proctor AI Platform</h1>
        <p className="text-xl bg-gray-700 p-4 rounded-lg">
          Connection Status: <span className="font-mono text-green-500">{message}</span>
        </p>
      </div>
    </main>
  );
}
