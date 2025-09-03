import React, { useEffect, useRef } from 'react';

const formatTime = (ts) => new Date(ts).toLocaleTimeString();

export default function ChatWindow({ messages, selfUser }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat-window">
      {messages.map((m) => (
        <div
          key={m.id || `${m.user}-${m.time}`}
          className={`message ${m.user === selfUser ? 'own' : ''}`}
        >
          <div className="meta">
            <span className="user">{m.user || 'Anonymous'}</span>
            <span className="time">{formatTime(m.time)}</span>
          </div>
          <div className="text">{m.text}</div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
