import React, { useState, useEffect } from 'react';

function PWAStatus() {
  const [isPWA, setIsPWA] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Check if the app is running as a PWA
    const checkPWAStatus = () => {
      // Check if the app is installed (standalone mode)
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                          window.navigator.standalone === true;
      
      // Check if running in a service worker context
      const hasServiceWorker = 'serviceWorker' in navigator;
      
      setIsPWA(isStandalone || hasServiceWorker);
    };

    // Check online status
    const handleOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    checkPWAStatus();
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  if (!isPWA) return null;

  return (
    <div className="pwa-status" style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      backgroundColor: isOnline ? '#4CAF50' : '#F44336',
      color: 'white',
      padding: '5px 10px',
      borderRadius: '15px',
      fontSize: '12px',
      fontWeight: 'bold',
      zIndex: 999,
      display: 'flex',
      alignItems: 'center',
      gap: '5px'
    }}>
      <div style={{
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        backgroundColor: isOnline ? '#fff' : '#fff',
        animation: isOnline ? 'none' : 'pulse 2s infinite'
      }}></div>
      {isOnline ? 'Online' : 'Offline'}
    </div>
  );
}

export default PWAStatus; 