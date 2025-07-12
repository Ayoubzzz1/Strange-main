import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import { useEffect } from 'react';  // Import useEffect
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Welcome from './pages/Welcome';
import Login from './Auth/Login';
import Register from './Auth/Register';
import Home from './pages/Home';
import Verfiy from './Auth/Verfiy';
import Chat from './pages/Chat';
import { useUserStatus } from './online comp/useUserStatus';
import PWAInstall from './components/PWAInstall';
import PWAUpdate from './components/PWAUpdate';
import PWAStatus from './components/PWAStatus';

function App() {
  useUserStatus();
  
  // Add console log for debugging
  useEffect(() => {
    console.log('App component mounted');
    
    // Debug PWA status
    console.log('PWA Debug Info:');
    console.log('- HTTPS:', window.location.protocol === 'https:');
    console.log('- Service Worker:', 'serviceWorker' in navigator);
    console.log('- Standalone:', window.matchMedia('(display-mode: standalone)').matches);
    console.log('- Navigator standalone:', window.navigator.standalone);
    
    // Check if manifest is loaded
    const manifestLink = document.querySelector('link[rel="manifest"]');
    console.log('- Manifest link:', manifestLink ? 'Found' : 'Not found');
    
    // Check service worker registration
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then(registration => {
        console.log('- Service Worker registered:', !!registration);
        if (registration) {
          console.log('- Service Worker state:', registration.active ? 'Active' : 'Inactive');
        }
      });
    }
  }, []);

  return (
    <Router>
      <TitleUpdater />
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/verif" element={<Verfiy />} />
        <Route path="/chat" element={<Chat />} />
        {/* Catch-all route for any undefined routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <PWAInstall />
      <PWAUpdate />
      <PWAStatus />
    </Router>
  );
}

function TitleUpdater() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    let title = "Stranger"; // Default title

    // Change title based on the route
    if (path === "/login") {
      title = "Login";
    } else if (path === "/register") {
      title = "Register";
    } else if (path === "/home") {
      title = "Home";
    } else if (path === "/verif") {
      title = "Verify Account";
    }
    // Set the document title dynamically
    document.title = title;
  }, [location]);

  return null;
}

export default App;
