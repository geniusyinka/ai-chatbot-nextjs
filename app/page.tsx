"use client"; // Add this line at the top to make it a client component

import { useState } from 'react';
import axios from 'axios';

// Define the message type
interface Message {
  role: 'user' | 'ai';
  content: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') return;

    const userMessage: Message = { role: 'user', content: inputMessage };
    setMessages([...messages, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await axios.post<{ message: string }>('/api/chat', { message: inputMessage });
      const aiMessage: Message = { role: 'ai', content: response.data.message };

      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error: unknown) {
  if (axios.isAxiosError(error)) {
    const errorMessage: Message = {
      role: 'ai',
      content: error.response?.data?.message || 'Error communicating with AI',
    };
    setMessages((prevMessages) => [...prevMessages, errorMessage]);
  } else {
    const errorMessage: Message = { role: 'ai', content: 'An unknown error occurred' };
    setMessages((prevMessages) => [...prevMessages, errorMessage]);
  }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1>AI Chat</h1>

      <div
        style={{
          border: '1px solid #ccc',
          borderRadius: '5px',
          padding: '10px',
          height: '400px',
          overflowY: 'scroll',
          marginBottom: '20px',
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              textAlign: msg.role === 'user' ? 'right' : 'left',
              padding: '10px',
              background: msg.role === 'user' ? '#e1ffc7' : '#f0f0f0',
              borderRadius: '5px',
              margin: '10px 0',
            }}
          >
            {msg.content}
          </div>
        ))}

        {loading && <div>Loading...</div>}
      </div>

      <input
        type="text"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
        placeholder="Type your message"
        style={{
          width: '100%',
          padding: '10px',
          borderRadius: '5px',
          border: '1px solid #ccc',
          marginBottom: '10px',
        }}
      />
      <button onClick={handleSendMessage} disabled={loading} style={{ width: '100%', padding: '10px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '5px' }}>
        Send
      </button>
    </div>
  );
}
