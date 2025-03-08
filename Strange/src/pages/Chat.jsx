
import React, { useState, useEffect, useRef } from 'react';
import { getDatabase, ref, push, serverTimestamp, onValue } from 'firebase/database';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, updateProfile } from '../online comp/firebase-config';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { useUserStatus } from '../online comp/useUserStatus'; // Ensure this is imported
import MessagesBox from '../chat comp/MessagesBox'; // Import MessagesBox component

function Chat() {
  // State variables
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('Anonymous');
  const [currentUser, setCurrentUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  // Hooks and utilities
  const database = getDatabase();
  const messagesEndRef = useRef(null);  // Define the ref
  const navigate = useNavigate();

  // Use the user status hook
  useUserStatus();

  // Authentication state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        fetchUserName(user);
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Fetch online users
  useEffect(() => {
    const statusRef = ref(database, 'status');
    const unsubscribe = onValue(statusRef, (snapshot) => {
      const statusData = snapshot.val();
      if (statusData) {
        const onlineUsersList = Object.values(statusData)
          .filter(user => user.online)
          .map(user => ({
            userId: user.userId,
            username: user.username
          }));
        setOnlineUsers(onlineUsersList);
      }
    });

    return () => unsubscribe();
  }, [database]);

  // Fetch username from Firestore
  const fetchUserName = async (user) => {
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      let username = 'Anonymous';
      if (userDoc.exists()) {
        username = userDoc.data().username || user.displayName || 'Anonymous';
      } else {
        username = user.displayName || 'Anonymous';
      }

      setUserName(username);
      
      // Update profile if no display name
      if (!user.displayName) {
        await updateProfile(user, { displayName: username });
      }

      return username;
    } catch (error) {
      console.error('Error fetching username:', error);
      return 'Anonymous';
    }
  };

  // Handle message sending
  const handleSendMessage = async () => {
    if (newMessage.trim() === '' || !currentUser) return;

    try {
      const username = await fetchUserName(currentUser);

      // Push new message to Firebase
      const messagesRef = ref(database, 'chat/messages');
      await push(messagesRef, {
        user: username,
        message: newMessage,
        timestamp: serverTimestamp(),
        userId: currentUser.uid
      });

      // Clear the input field after sending
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Fetch and listen to messages
  useEffect(() => {
    if (!currentUser) return;

    const messagesRef = ref(database, 'chat/messages');
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      const loadedMessages = [];
      
      if (data) {
        for (let key in data) {
          loadedMessages.push({ id: key, ...data[key] });
        }
        
        // Sort messages by timestamp
        loadedMessages.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
      }
      
      setMessages(loadedMessages);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Handle message input submission on Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Render the chat interface
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
        backgroundColor: '#1a0632',
      }}
    >
      {/* Header with Logout */}
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
          onClick={handleLogout}
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

      {/* Online Users Section */}
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

      {/* Messages Box Component */}
      <MessagesBox 
        messages={messages} 
        loading={loading} 
        currentUser={currentUser} 
        messagesEndRef={messagesEndRef} 
      />

      {/* Message Input Area */}
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
    </div>
  );
}

export default Chat;
