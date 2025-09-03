import React, { useState } from 'react';

export default function MessageInput({ username, onUsernameChange, onSend }) {
  const [name, setName] = useState(username || '');
  const [text, setText] = useState('');

  const handleSend = () => {
    if (!text.trim()) return;
    onUsernameChange(name.trim());
    onSend(text.trim(), name);
    setText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="input-bar">
      <input
        className="input username"
        placeholder="Username"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <input
        className="input message"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button className="send-btn" onClick={handleSend}>Send</button>
    </div>
  );
}
