
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../online comp/firebase-config';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { getDatabase, ref, onValue, set, serverTimestamp } from 'firebase/database';
import UserGreeting from '../home comp/UserGreeting';
import LogoutButton from '../home comp/LogoutButton';
import OnlineUsersList from '../online comp/OnlineUsersList';
import StartChatButton from '../home comp/StartChatButton';

function Home() {
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const navigate = useNavigate();
  const database = getDatabase();

  useEffect(() => {
    console.log('Home component mounted');
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log('Current authenticated user:', user.uid);

        if (!user.emailVerified) {
          navigate('/verif');
          return;
        }

        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);

          const username = userDoc.exists() 
            ? userDoc.data().username || user.displayName 
            : user.displayName || 'Anonymous User';

          setUserName(username);

          const userStatusRef = ref(database, `status/${user.uid}`);
          const connectedRef = ref(database, '.info/connected');
          onValue(connectedRef, async (snapshot) => {
            console.log('Connection status:', snapshot.val());
            
            if (snapshot.val() === true) {
              await set(userStatusRef, {
                userId: user.uid,
                username: username,
                online: true,
                lastSeen: serverTimestamp()
              });

              onDisconnect(userStatusRef).set({
                userId: user.uid,
                username: username,
                online: false,
                lastSeen: serverTimestamp()
              });
            }
          });

          const statusRef = ref(database, 'status');
          const unsubscribeStatus = onValue(statusRef, (snapshot) => {
            console.log('Full status snapshot:', snapshot.val());
            
            const onlineUsersList = [];
            snapshot.forEach((childSnapshot) => {
              const userData = childSnapshot.val();
              console.log('Individual user status:', userData);
              
              if (userData.online === true) {
                onlineUsersList.push({
                  userId: userData.userId,
                  username: userData.username
                });
              }
            });

            console.log('Online Users List:', onlineUsersList);

            const uniqueOnlineUsers = Array.from(
              new Map(onlineUsersList.map(user => [user.userId, user])).values()
            );

            setOnlineUsers(uniqueOnlineUsers);
          }, (error) => {
            console.error('Error fetching online users:', error);
          });

          return () => {
            unsubscribeStatus();
            set(userStatusRef, { 
              userId: user.uid,
              username: username,
              online: false,
              lastSeen: serverTimestamp() 
            });
          };

        } catch (error) {
          console.error('Error setting up user status:', error);
        } finally {
          setLoading(false);
        }
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userStatusRef = ref(database, `status/${user.uid}`);
        await set(userStatusRef, { 
          userId: user.uid,
          username: userName,
          online: false,
          lastSeen: serverTimestamp() 
        });

        await auth.signOut();
        navigate('/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handlGo = () => {
    navigate('/chat');
  };

  return (
    <div
      style={{
        textAlign: 'center',
        padding: '50px',
        backgroundColor: '#1a0632',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <UserGreeting userName={userName} />
      <LogoutButton handleLogout={handleLogout} />
      <OnlineUsersList onlineUsers={onlineUsers} />
      <StartChatButton handleGo={handlGo} />
    </div>
  );
}

export default Home;
