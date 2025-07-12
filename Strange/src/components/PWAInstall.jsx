import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

function PWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isPWAInstalled, setIsPWAInstalled] = useState(false);
  const [showManualInstall, setShowManualInstall] = useState(false);

  useEffect(() => {
    // Check if already installed
    const checkIfInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsPWAInstalled(true);
        return;
      }
      if (window.navigator.standalone === true) {
        setIsPWAInstalled(true);
        return;
      }
    };

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      console.log('Install prompt triggered');
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      // Show the install button
      setShowInstallButton(true);
    };

    // Listen for the appinstalled event
    const handleAppInstalled = () => {
      console.log('App installed');
      // Hide the install button
      setShowInstallButton(false);
      setShowManualInstall(false);
      // Clear the deferredPrompt
      setDeferredPrompt(null);
      setIsPWAInstalled(true);
      toast.success('App installed successfully!');
    };

    // Check if service worker is registered
    const checkServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.getRegistration();
          if (registration) {
            console.log('Service worker is registered');
          } else {
            console.log('No service worker found');
          }
        } catch (error) {
          console.error('Error checking service worker:', error);
        }
      }
    };

    checkIfInstalled();
    checkServiceWorker();

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Show manual install button after 10 seconds if no automatic prompt
    const manualInstallTimer = setTimeout(() => {
      if (!isPWAInstalled && !showInstallButton) {
        setShowManualInstall(true);
      }
    }, 10000);

    // Also check periodically for install prompt
    const checkInterval = setInterval(() => {
      if (!isPWAInstalled && !showInstallButton) {
        // Check if we can install
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.getRegistration().then(registration => {
            if (registration && registration.active) {
              // Service worker is active, app should be installable
              console.log('Service worker active, app should be installable');
            }
          });
        }
      }
    }, 5000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      clearInterval(checkInterval);
      clearTimeout(manualInstallTimer);
    };
  }, [isPWAInstalled, showInstallButton]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      console.log('No deferred prompt available');
      return;
    }

    console.log('Showing install prompt');
    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    console.log('User choice:', outcome);
    if (outcome === 'accepted') {
      toast.success('App installation started!');
    } else {
      toast.error('App installation cancelled');
    }

    // Clear the deferredPrompt
    setDeferredPrompt(null);
    setShowInstallButton(false);
  };

  const handleManualInstall = () => {
    // Show instructions for manual installation
    const instructions = `
      To install this app:
      
      1. Click the menu (⋮) in your browser
      2. Select "Install app" or "Add to Home Screen"
      3. Follow the prompts to install
      
      Or look for the install icon (📱) in your browser's address bar.
    `;
    
    toast(instructions, {
      duration: 8000,
      icon: '📱',
    });
  };

  // Don't show if already installed
  if (isPWAInstalled) return null;

  // Show either automatic or manual install button
  const shouldShowInstall = showInstallButton || showManualInstall;
  if (!shouldShowInstall) return null;

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
          {showInstallButton ? 'Get the best experience with our app' : 'Click for installation instructions'}
        </div>
      </div>
      <button
        onClick={showInstallButton ? handleInstallClick : handleManualInstall}
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
        {showInstallButton ? 'Install' : 'How to Install'}
      </button>
      <button
        onClick={() => {
          setShowInstallButton(false);
          setShowManualInstall(false);
        }}
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