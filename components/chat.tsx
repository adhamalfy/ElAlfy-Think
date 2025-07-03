"use client";
import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';


     const genAI = new GoogleGenerativeAI('AIzaSyB6BsztybkrtNBtbVHfmYT-Xyql1eek1zw');


interface Message {
  role: 'user' | 'bot';
  content: string;
}

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const sendMessage = async () => {
    if (input.trim() === '') return;

    // Add user message to the chat
    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Initialize the Gemini model
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      // Send the message to Gemini API
      const result = await model.generateContent(input);
      const response = await result.response;
      const text = response.text();

      // Add bot response to the chat
      const botMessage: Message = { role: 'bot', content: text };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error fetching response:', error);
      const errorMessage: Message = { role: 'bot', content: 'Something went wrong. Please try again.' };
      setMessages((prev) => [...prev, errorMessage]);
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
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Logo Header */}
      <div className="p-4 text-center">
        <img src="/assests/logo.png" alt="Logo" className="mx-auto h-12" /> {/* Replace with your logo path */}
      </div>
      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-800 rounded-lg shadow-inner">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 my-2 rounded-lg ${
              msg.role === 'user'
                ? 'bg-blue-600 ml-auto text-right max-w-xs'
                : 'bg-gray-700 mr-auto max-w-xs'
            }`}
          >
            <strong>{msg.role === 'user' ? 'You' : 'Bot'}:</strong> {msg.content}
          </div>
        ))}
        {loading && <div className="p-2 my-2 rounded-lg bg-gray-700 mr-auto max-w-xs">Loading...</div>}
      </div>
      {/* Input Area */}
      <div className="p-4 bg-gray-900">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={loading}
            className="flex-1 p-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;