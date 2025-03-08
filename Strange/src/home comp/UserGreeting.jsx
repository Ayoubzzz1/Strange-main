// UserGreeting.js
import React from 'react';

const UserGreeting = ({ userName }) => (
  <h1 style={{ color: '#ff5733', marginBottom: '20px' }}>
    Welcome, <span style={{ color: 'white' }}>{userName}</span>!
  </h1>
);

export default UserGreeting;
