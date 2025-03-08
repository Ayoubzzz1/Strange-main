// LogoutButton.js
import React from 'react';

const LogoutButton = ({ handleLogout }) => (
  <button
    onClick={handleLogout}
    style={{
      backgroundColor: '#ff5733',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '5px',
      cursor: 'pointer',
    }}
  >
    Logout
  </button>
);

export default LogoutButton;
