import React, { useState, useEffect } from "react";
import io from "socket.io-client";

// Connect frontend to backend
const socket = io("http://localhost:4000");

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    // Listen for messages from backend
    socket.on("chat message", (msg) => {
      setChat((prevChat) => [...prevChat, msg]);
    });

    // Cleanup listener
    return () => {
      socket.off("chat message");
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() === "") return;
    socket.emit("chat message", message); // send to backend
    setMessage(""); // clear input
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontFamily: "Segoe UI, Roboto, Arial, sans-serif",
        background: "#e9ecef",
      }}
    >
      <h1 style={{ marginBottom: "20px", color: "#343a40" }}>
        Realtime Chat App 🚀
      </h1>

      <div
        style={{
          border: "1px solid #dee2e6",
          padding: "15px",
          height: "400px",
          width: "500px",
          overflowY: "scroll",
          marginBottom: "15px",
          background: "#ffffff",
          borderRadius: "12px",
          boxShadow: "0px 4px 20px rgba(0,0,0,0.05)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {chat.map((msg, idx) => (
          <div
            key={idx}
            style={{
              alignSelf: idx % 2 === 0 ? "flex-start" : "flex-end", // alternate alignment
              background: idx % 2 === 0 ? "#f1f3f5" : "#0d6efd",
              color: idx % 2 === 0 ? "#212529" : "#ffffff",
              padding: "10px 14px",
              borderRadius: "20px",
              margin: "5px 0",
              maxWidth: "70%",
            }}
          >
            {msg}
          </div>
        ))}
      </div>

      <form
        onSubmit={sendMessage}
        style={{ display: "flex", width: "500px", justifyContent: "space-between" }}
      >
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          style={{
            padding: "12px",
            flex: 1,
            border: "1px solid #ced4da",
            borderRadius: "8px",
            outline: "none",
            fontSize: "14px",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "12px 20px",
            marginLeft: "10px",
            background: "#0d6efd",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "0.3s",
          }}
          onMouseOver={(e) => (e.target.style.background = "#0b5ed7")}
          onMouseOut={(e) => (e.target.style.background = "#0d6efd")}
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default App;
