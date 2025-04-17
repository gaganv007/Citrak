import React from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/api';

const Navbar = () => {
  const user = authService.getCurrentUser();
  
  const handleLogout = () => {
    authService.logout();
    window.location.href = '/login';
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">Citrak</Link>
      </div>
      
      <div className="navbar-links">
        <Link to="/" className="nav-link">Dashboard</Link>
        <Link to="/live-map" className="nav-link">Live Map</Link>
        <Link to="/settings" className="nav-link">Settings</Link>
        
        {user ? (
          <button onClick={handleLogout} className="nav-link logout-btn">Logout</button>
        ) : (
          <Link to="/login" className="nav-link">Login</Link>
        )}
      </div>
      
      <style jsx>{`
        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: #1e293b;
          color: white;
          padding: 0 1.5rem;
          height: 60px;
        }
        
        .navbar-logo a {
          color: white;
          font-size: 1.5rem;
          font-weight: bold;
          text-decoration: none;
        }
        
        .navbar-links {
          display: flex;
          gap: 1.5rem;
        }
        
        .nav-link {
          color: white;
          text-decoration: none;
          font-size: 1rem;
          padding: 0.5rem 0;
          transition: color 0.2s;
        }
        
        .nav-link:hover {
          color: #90cdf4;
        }
        
        .logout-btn {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          font-size: 1rem;
          padding: 0;
        }
        
        .logout-btn:hover {
          color: #f56565;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;