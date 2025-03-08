import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate hook
import './welcome.css';

function Welcome() {
  const navigate = useNavigate();  // Hook for navigation

  useEffect(() => {
    // Redirect to login after 3 seconds
    const timer = setTimeout(() => {
      navigate('/login');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="welcome-container">
      <h1 className="welcome-title">
        <span className="white-text">Hey</span>{' '}
        <span className="accent-text">Stranger</span>
      </h1>

      {/* Optionally, you can add other content here, like text or animations */}
    </div>
  );
}

export default Welcome;
