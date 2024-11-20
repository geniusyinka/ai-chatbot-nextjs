"use client"; // Add this line at the top to make it a client component

import { useState } from "react";
import axios from "axios";

// Define the message type
interface Message {
  role: "user" | "ai";
  content: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSendMessage = async () => {
    if (inputMessage.trim() === "") return;

    const userMessage: Message = { role: "user", content: inputMessage };
    setMessages([...messages, userMessage]);
    setInputMessage("");
    setLoading(true);

    try {
      const response = await axios.post<{ message: string }>("/api/chat", {
        message: inputMessage,
      });
      const aiMessage: Message = { role: "ai", content: response.data.message };

      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errorMessage: Message = {
          role: "ai",
          content:
            error.response?.data?.message || "Error communicating with AI",
        };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      } else {
        const errorMessage: Message = {
          role: "ai",
          content: "An unknown error occurred",
        };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <div className="header" style={{ margin: "20px", fontSize: "20px" }}>
        <center>
          <h1>AI Chat</h1>
        </center>
      </div>

      {messages.length === 0 ? (
        <div className="info" style={{ height: "340px" }}>
          <div className="info-text" style={{width: '350px', margin: '0 auto', textAlign: 'center'}}>
            <p>
              This is an open source chatbot template built with Next.js
              deployed on Fleek!
            </p>
            <center>
              <b>
                <a href="#">GitHub Link</a>
              </b>
            </center>
          </div>
        </div>
      ) : (
        <div className="messages" style={{ height: "400px" }}>
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                textAlign: msg.role === "user" ? "right" : "left",
                padding: "10px",
                borderRadius: "5px",
                margin: "10px 0",
              }}
            >
              {msg.content}
            </div>
          ))}

          {loading && (
            <div style={{ textAlign: "center", color: "#555" }}>
              thinking...
            </div>
          )}
        </div>
      )}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "10px",
          borderRadius: ".75rem",
          backgroundColor: "#1f1f1f",
          border: "1px solid #3a3a3a",
          gap: "10px",
        }}
      >
        <textarea
          placeholder="Send a message..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault(); // Prevents adding a new line
              handleSendMessage();
            }
          }}
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            backgroundColor: "transparent",
            color: "#ffffff",
            fontSize: "16px",
            resize: "none", // Prevents resizing
            overflow: "hidden",
            height: "2rem", // Adjust this to match the design
          }}
        />
        <button
          onClick={handleSendMessage}
          style={{
            border: "none",
            backgroundColor: "transparent",
            cursor: "pointer",
            color: "#ffffff",
            fontSize: "18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-label="Send message"
        >
          <span role="img" aria-label="Send">
            📩
          </span>
        </button>
      </div>
    </div>
  );
}
