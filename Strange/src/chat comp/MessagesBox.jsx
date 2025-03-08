import React, { useEffect } from 'react';

function MessagesBox({ messages, loading, currentUser, messagesEndRef }) {
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div
      style={{
        flexGrow: 1,
        overflowY: 'auto',
        border: '1px solid #ccc',
        padding: '10px',
        backgroundColor: 'white',
        marginBottom: '10px',
        borderRadius: '5px'
      }}
    >
      {loading ? (
        <p style={{ textAlign: 'center', color: '#666' }}>Loading messages...</p>
      ) : messages.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666' }}>No messages yet</p>
      ) : (
        messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              padding: '10px',
              marginBottom: '10px',
              borderBottom: '1px solid #eee',
              backgroundColor: msg.userId === currentUser?.uid ? '#f0f0f0' : 'white'
            }}
          >
            <strong style={{ color: '#FF5733' }}>
              {msg.user || 'Anonymous'}:
            </strong> 
            <span style={{ marginLeft: '10px' }}>{msg.message}</span>
          </div>
        ))
      )}

      {/* Scroll to bottom reference */}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default MessagesBox;
