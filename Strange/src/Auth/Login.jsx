import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../online comp/firebase-config';
import { doc, getDoc } from 'firebase/firestore';
import { getDatabase, ref, set, serverTimestamp } from 'firebase/database';
import toast, { Toaster } from 'react-hot-toast';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    const loginPromise = async () => {
      try {
        // Authenticate user
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Fetch username from Firestore
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        const username = userDoc.exists() 
          ? userDoc.data().username 
          : user.displayName || email.split('@')[0];

        // Set online status in Realtime Database
        const database = getDatabase();
        const userStatusRef = ref(database, `status/${user.uid}`);
        await set(userStatusRef, {
          userId: user.uid,
          username: username,
          online: true,
          lastSeen: serverTimestamp()
        });

        // Navigate based on email verification
        if (user.emailVerified) {
          navigate('/home');
        } else {
          navigate('/verif');
        }

        return user;
      } catch (error) {
        console.error('Error during login:', error.message);
        
        switch (error.code) {
          case 'auth/user-not-found':
            throw new Error('No user found with this email.');
          case 'auth/wrong-password':
            throw new Error('Incorrect password.');
          case 'auth/invalid-email':
            throw new Error('Invalid email address.');
          default:
            throw new Error('Login failed. Please try again.');
        }
      }
    };

    // Use toast promise for login
    toast.promise(loginPromise(), {
      loading: 'Logging in...',
      success: 'Login successful!',
      error: (err) => err.message
    });
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#1a0632' }}>
      <Toaster 
        position="top-right"
        toastOptions={{
          success: {
            style: {
              background: '#4CAF50',
              color: 'white',
            },
          },
          error: {
            style: {
              background: '#F44336',
              color: 'white',
            },
          },
        }}
      />

      <div className="card p-4" style={{ width: '400px', borderRadius: '10px', backgroundColor: '#1a0632' }}>
        <h3 className="text-center mb-4" style={{ color: '#ff5733' }}>Login</h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label" style={{ color: 'white' }}>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{ backgroundColor: '#2c0d56', color: 'white' }}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label" style={{ color: 'white' }}>
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{ backgroundColor: '#2c0d56', color: 'white' }}
            />
          </div>
          <button 
            type="submit" 
            className="btn" 
            style={{ 
              backgroundColor: '#ff5733', 
              color: 'white', 
              width: '100%' 
            }}
          >
            Login
          </button>
        </form>

        <div className="text-center mt-3">
          <p style={{ color: 'white' }}>
            Don't have an account? {' '}
            <a 
              href="/register" 
              style={{ 
                color: '#ff5733', 
                textDecoration: 'none' 
              }}
            >
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;