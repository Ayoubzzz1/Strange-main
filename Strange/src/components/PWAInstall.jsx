import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

function PWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      // Show the install button
      setShowInstallButton(true);
    };

    // Listen for the appinstalled event
    const handleAppInstalled = () => {
      // Hide the install button
      setShowInstallButton(false);
      // Clear the deferredPrompt
      setDeferredPrompt(null);
      toast.success('App installed successfully!');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      toast.success('App installation started!');
    } else {
      toast.error('App installation cancelled');
    }

    // Clear the deferredPrompt
    setDeferredPrompt(null);
    setShowInstallButton(false);
  };

  if (!showInstallButton) return null;

  return (
    <div className="pwa-install-banner" style={{
      position: 'fixed',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: '#1a0632',
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
          Install Stranger App
        </div>
        <div style={{ fontSize: '14px', opacity: 0.8 }}>
          Get the best experience with our app
        </div>
      </div>
      <button
        onClick={handleInstallClick}
        style={{
          backgroundColor: '#ff5733',
          color: 'white',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '5px',
          cursor: 'pointer',
          fontWeight: 'bold',
          whiteSpace: 'nowrap'
        }}
      >
        Install
      </button>
      <button
        onClick={() => setShowInstallButton(false)}
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

export default PWAInstall; 