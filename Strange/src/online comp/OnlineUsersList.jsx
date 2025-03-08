// OnlineUsersList.js
import React from 'react';

const OnlineUsersList = ({ onlineUsers }) => (
  <div
    style={{
      marginTop: '50px',
      backgroundColor: '#f4f4f4',
      padding: '20px',
      borderRadius: '10px',
      width: '80%',
      maxWidth: '500px',
    }}
  >
    <h2 style={{ color: '#333' }}>Online Users:</h2>
    <ul style={{ listStyleType: 'none', padding: 0 }}>
      {onlineUsers.length > 0 ? (
        onlineUsers.map((user) => (
          <li
            key={user.userId}
            style={{
              marginBottom: '10px',
              color: '#ff5733',
              fontWeight: 'bold',
            }}
          >
            {user.username}
          </li>
        ))
      ) : (
        <li style={{ color: '#333' }}>No users online</li>
      )}
    </ul>
  </div>
);

export default OnlineUsersList;
