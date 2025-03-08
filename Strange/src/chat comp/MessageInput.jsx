import React from 'react';

function MessageInput({ newMessage, setNewMessage, handleSendMessage, handleKeyPress }) {
  return (
    <div style={{ display: 'flex' }}>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type your message..."
        style={{
          flexGrow: 1,
          padding: '10px',
          borderRadius: '5px',
          border: '1px solid #ccc',
        }}
      />
      <button
        onClick={handleSendMessage}
        style={{
          marginLeft: '10px',
          padding: '10px 20px',
          backgroundColor: '#FF5733',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Send
      </button>
    </div>
  );
}

export default MessageInput;
