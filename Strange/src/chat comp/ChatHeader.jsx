import React from 'react';

function ChatHeader({ onLogout }) {
  return (
    <div 
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px'
      }}
    >
      <h2 style={{ color: 'white', margin: 0 }}>Chatroom</h2>
      <button
        onClick={onLogout}
        style={{
          backgroundColor: '#FF5733',
          color: 'white',
          border: 'none',
          padding: '5px 10px',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default ChatHeader;
