// StartChatButton.js
import React from 'react';

const StartChatButton = ({ handleGo }) => (
  <button
    onClick={handleGo}
    style={{
      backgroundColor: '#ff5733',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '5px',
      cursor: 'pointer',
    }}
  >
    Start Chat
  </button>
);

export default StartChatButton;
