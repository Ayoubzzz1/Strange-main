import React from 'react';

function OnlineUsers({ onlineUsers }) {
  return (
    <div 
      style={{
        backgroundColor: '#f4f4f4',
        padding: '10px',
        marginBottom: '10px',
        borderRadius: '5px'
      }}
    >
      <h3 style={{ color: '#333', marginBottom: '10px' }}>Online Users:</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
        {onlineUsers.length > 0 ? (
          onlineUsers.map((user) => (
            <span 
              key={user.userId}
              style={{
                backgroundColor: '#FF5733',
                color: 'white',
                padding: '5px 10px',
                borderRadius: '3px',
                fontSize: '0.8em'
              }}
            >
              {user.username}
            </span>
          ))
        ) : (
          <span style={{ color: '#666' }}>No users online</span>
        )}
      </div>
    </div>
  );
}

export default OnlineUsers;
