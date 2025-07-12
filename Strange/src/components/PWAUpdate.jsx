import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

function PWAUpdate() {
  const [showUpdateButton, setShowUpdateButton] = useState(false);

  useEffect(() => {
    // Check if the app is running as a PWA
    if ('serviceWorker' in navigator) {
      // Listen for service worker updates
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        // New service worker is controlling the page
        toast.success('App updated! New version is now active.');
      });

      // Check for updates
      const checkForUpdates = async () => {
        try {
          const registration = await navigator.serviceWorker.getRegistration();
          if (registration) {
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New content is available
                  setShowUpdateButton(true);
                  toast('New version available!', {
                    icon: '🔄',
                    duration: 5000,
                  });
                }
              });
            });
          }
        } catch (error) {
          console.error('Error checking for updates:', error);
        }
      };

      checkForUpdates();
    }
  }, []);

  const handleUpdate = () => {
    // Reload the page to activate the new service worker
    window.location.reload();
  };

  if (!showUpdateButton) return null;

  return (
    <div className="pwa-update-banner" style={{
      position: 'fixed',
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: '#ff5733',
      color: 'white',
      padding: '15px 20px',
      borderRadius: '10px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      maxWidth: '90vw'
    }}>
      <div>
        <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
          Update Available
        </div>
        <div style={{ fontSize: '14px', opacity: 0.8 }}>
          A new version is ready to install
        </div>
      </div>
      <button
        onClick={handleUpdate}
        style={{
          backgroundColor: '#1a0632',
          color: 'white',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '5px',
          cursor: 'pointer',
          fontWeight: 'bold',
          whiteSpace: 'nowrap'
        }}
      >
        Update
      </button>
      <button
        onClick={() => setShowUpdateButton(false)}
        style={{
          backgroundColor: 'transparent',
          color: 'white',
          border: 'none',
          padding: '8px',
          cursor: 'pointer',
          fontSize: '18px'
        }}
      >
        ×
      </button>
    </div>
  );
}

export default PWAUpdate; 