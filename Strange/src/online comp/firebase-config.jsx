import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getAuth, updateProfile } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCGSJXuIi1wfQvwpffhnfsm3Uya0HkCa4w", 
  authDomain: "stranger-831c4.firebaseapp.com",
  projectId: "stranger-831c4",
  storageBucket: "stranger-831c4.appspot.com",
  messagingSenderId: "935745628749",
  appId: "1:935745628749:web:c1b416217ef5d5e79f0a04",
  measurementId: "G-KF8N1YPQLH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Auth and Firestore services
const auth = getAuth(app);
const db = getFirestore(app);

// Export Firebase Auth, Firestore, and updateProfile for use in other parts of your app
export { auth, db, updateProfile, storage  };

// Initialize Firebase Storage
const storage = getStorage(app);
// Firestore function to add user data
export const addUserData = async (userData) => {
  try {
    // Reference to the 'users' collection in Firestore
    const docRef = await addDoc(collection(db, "users"), userData);
    console.log("User data added with ID: ", docRef.id);
    return docRef.id; // Returning the document ID after successful addition
  } catch (e) {
    console.error("Error adding user data: ", e);
    throw new Error("Failed to add user data to Firestore.");
  }
};

// Optional: Update Firebase user profile
export const updateUserProfile = async (displayName, photoURL) => {
  try {
    await updateProfile(auth.currentUser, { displayName, photoURL });
    console.log("Profile updated successfully");
  } catch (error) {
    console.error("Error updating profile: ", error);
    throw new Error("Profile update failed.");
  }
};
