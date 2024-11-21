"use client"; // Add this line at the top to make it a client component

import { useState, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

// Define the message type
interface Message {
  role: "user" | "ai";
  content: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
    const [isInfoVisible, setIsInfoVisible] = useState(true);

    useEffect(() => {
      // Toggle the visibility of the info section when messages change
      if (messages.length > 0) {
        setIsInfoVisible(false);
      }
    }, [messages]);

    const preprocessContent = (content: string): string => {
      // Split content into sentences using regex and join them with line breaks
      const sentences = content.match(/[^.!?]+[.!?]+/g) || [content];
      return sentences.join("\n\n"); // Add two newlines between sentences
    };

    const handleSendMessage = async () => {
      if (inputMessage.trim() === "") return; // Do nothing if the input is empty
    
      const userMessage: Message = { role: "user", content: inputMessage };
      setMessages([...messages, userMessage]); // Add user's message to the chat
      setInputMessage(""); // Clear the input field
    
      if (loading) return; // Prevent sending multiple requests while loading
      setLoading(true); // Set loading state to true
    
      try {
        const response = await axios.post<{ message: string }>("/api/chat", {
          message: inputMessage, // Send the user's message to the API
        });
    
        const aiMessage: Message = { role: "ai", content: preprocessContent(response.data.message) };
        setMessages((prevMessages) => [...prevMessages, aiMessage]); // Add AI's response
      } catch (error: unknown) {
        const errorMessage: Message = {
          role: "ai",
          content:
            axios.isAxiosError(error) && error.response?.data?.message
              ? error.response.data.message
              : "An error occurred while communicating with AI.",
        };
        setMessages((prevMessages) => [...prevMessages, errorMessage]); // Show error message
      } finally {
        setLoading(false); // Reset loading state
      }
    };
    

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <div className="header" style={{ margin: "20px", fontSize: "20px" }}>
        <center>
          <h1>AI Chat</h1>
        </center>
      </div>

 <div
        style={{
          transition: "height 0.5s ease", // Smooth height transition
          height: isInfoVisible ? "340px" : "70vh", // Dynamically adjust height
          overflow: "scroll", // Prevent content from spilling during transition
          marginBottom: "20px",

          borderRadius: "8px",
          padding: "10px",
        }}
      >
        {isInfoVisible ? (
          <div
            className="info-text"
            style={{ width: "350px", margin: "0 auto", textAlign: "center" }}
          >
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
        ) : (
          <div className="messages" style={{ overflowY: "auto" }}>
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  textAlign: msg.role === "user" ? "right" : "left",
                  padding: "10px",
                  borderRadius: "5px",
                  margin: "10px 0",
                  // backgroundColor: msg.role === "user" ? "#e0e0e0" : "#fff",
                  color: msg.role === "user" ? "#fff" : "#fff",
                  
                }}
              >
                {msg.role === "ai" ? (
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                ) : (
                  
                    msg.content
                  
                )}
              </div>
            ))}

            {loading && (
              <div
                style={{
                  textAlign: "center",
                  color: "#555",
                  fontStyle: "italic",
                }}
              >
                Thinking...
              </div>
            )}
          </div>
        )}
      </div>



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
