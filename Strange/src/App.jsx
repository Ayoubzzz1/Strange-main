import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
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

function App() {
  useUserStatus();
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

      </Routes>
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
