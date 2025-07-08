"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Toaster, toast } from 'react-hot-toast';

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY!;
const genAI = new GoogleGenerativeAI(apiKey);

interface Message {
  role: 'user' | 'elalfy-ai';
  content: string;
}

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogout = () => {
    toast('Logged out successfully!', { icon: '🚪' });
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const name = localStorage.getItem("welcomeName");
      if (name) {
        toast.success(`Welcome, ${name}, to the chat page!`);
        localStorage.removeItem("welcomeName");
      }
    }
  }, []);

  const sendMessage = async () => {
    if (input.trim() === '') return;
    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(input);
      const response = await result.response;
      const text = response.text();
      const botMessage: Message = { role: 'elalfy-ai', content: text };
      setMessages((prev) => [...prev, botMessage]);
    } catch {
      setMessages((prev) => [...prev, { role: 'elalfy-ai', content: 'Something went wrong. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-gray-900">
      <aside className="w-64 bg-gray-950 border-r border-gray-800 flex flex-col items-center py-8 px-4">
        <Image src="/assests/logo.png" alt="Logo" width={250} height={250}  />
        <button
          onClick={handleLogout}
          className="w-full py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition mb-4"
        >
          Log out
        </button>
        <div className="flex-1" />
        <span className="text-gray-500 text-xs">elalfy-think © 2025</span>
      </aside>
      <div className="flex flex-col flex-1 h-full">
        <header className="w-full bg-gray-950 border-b border-gray-800 py-4 px-8 flex items-center gap-4 shadow-sm">
          <h1 className="text-2xl font-bold text-white tracking-tight">elalfy ChatBot</h1>
        </header>
        <div className="flex-1 overflow-y-auto p-8 bg-gray-900">
          <div className="max-w-2xl mx-auto flex flex-col gap-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`px-4 py-3 rounded-2xl shadow-md text-base whitespace-pre-line break-words max-w-xl ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white self-end rounded-br-md'
                    : 'bg-gray-800 text-gray-100 self-start rounded-bl-md'
                }`}
              >
                <span className="font-semibold mr-2">{msg.role === 'user' ? 'You' : 'Bot'}:</span> {msg.content}
              </div>
            ))}
            {loading && <div className="px-4 py-3 rounded-2xl bg-gray-800 text-gray-400 self-start max-w-xl">Loading...</div>}
          </div>
        </div>
        <div className="w-full bg-gray-950 border-t border-gray-800 py-4 px-8">
          <div className="max-w-2xl mx-auto flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={loading}
              className="flex-1 p-3 bg-gray-800 text-white border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-base font-semibold transition"
            >
              Send
            </button>
          </div>
        </div>
        <Toaster position="top-center" />
      </div>
    </div>
  );
};

export default ChatBot;
