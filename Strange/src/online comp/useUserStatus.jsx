import { useEffect, useState } from 'react';
import { auth, db } from './firebase-config';
import { getDatabase, ref, onDisconnect, set, serverTimestamp, onValue } from 'firebase/database';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export const useUserStatus = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  useEffect(() => {
    const database = getDatabase();

    const setupUserStatus = async () => {
      if (user) {
        try {
          // Fetch username from Firestore
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          const username = userDoc.exists() 
            ? userDoc.data().username || user.displayName 
            : user.displayName || 'Anonymous User';

          const userStatusRef = ref(database, `status/${user.uid}`);
          const connectedRef = ref(database, '.info/connected');

          // Listen to connection state
          const unsubscribeConnected = onValue(connectedRef, async (snapshot) => {
            if (snapshot.val() === true) {
              // User is connected
              await set(userStatusRef, {
                userId: user.uid,
                username: username,
                online: true,
                lastSeen: serverTimestamp()
              });

              // Set up disconnect behavior
              onDisconnect(userStatusRef).set({
                userId: user.uid,
                username: username,
                online: false,
                lastSeen: serverTimestamp()
              });
            }
          });

          // Return the unsubscribe function
          return () => {
            unsubscribeConnected();
          };
        } catch (error) {
          console.error('Error setting up user status:', error);
          // Return an empty function if there's an error
          return () => {};
        }
      }
      // Return an empty function if no user
      return () => {};
    };

    // Clean up function
    const cleanupUserStatus = async () => {
      if (user) {
        const userStatusRef = ref(database, `status/${user.uid}`);
        await set(userStatusRef, {
          userId: user.uid,
          username: user.displayName || 'Anonymous User',
          online: false,
          lastSeen: serverTimestamp()
        });
      }
    };

    // Call setupUserStatus and store its returned cleanup function
    const unsubscribePromise = setupUserStatus();

    // Cleanup on unmount
    return () => {
      cleanupUserStatus();
      
      // Properly handle the promise returned by setupUserStatus
      unsubscribePromise.then(cleanup => {
        if (typeof cleanup === 'function') {
          cleanup();
        }
      });
    };
  }, [user]);
};