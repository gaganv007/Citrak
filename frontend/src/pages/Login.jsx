import React, { useState } from 'react';
import { authService } from '../services/api';
import { useHistory } from 'react-router-dom';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const history = useHistory();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (isLogin) {
        // Login
        await authService.login({
          email: formData.email,
          password: formData.password
        });
      } else {
        // Register
        await authService.register({
          username: formData.username,
          email: formData.email,
          password: formData.password
        });
      }
      
      // Redirect to dashboard on success
      history.push('/');
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError('');
  };
  
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>{isLogin ? 'Login' : 'Register'}</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required={!isLogin}
              />
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Processing...' : isLogin ? 'Login' : 'Register'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={toggleAuthMode}
              className="toggle-link"
            >
              {isLogin ? 'Register' : 'Login'}
            </button>
          </p>
        </div>
      </div>
      
      <style jsx>{`
        .auth-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: calc(100vh - 60px);
          background-color: #f8fafc;
        }
        
        .auth-card {
          background-color: white;
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          padding: 2rem;
          width: 100%;
          max-width: 400px;
        }
        
        h1 {
          margin-top: 0;
          margin-bottom: 1.5rem;
          color: #1e293b;
          text-align: center;
        }
        
        .error-message {
          background-color: #fee2e2;
          color: #b91c1c;
          padding: 0.75rem;
          border-radius: 0.25rem;
          margin-bottom: 1.5rem;
          font-size: 0.875rem;
        }
        
        .form-group {
          margin-bottom: 1.25rem;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #475569;
        }
        
        .form-group input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.25rem;
          font-size: 1rem;
        }
        
        .auth-button {
          width: 100%;
          background-color: #3b82f6;
          color: white;
          border: none;
          border-radius: 0.25rem;
          padding: 0.75rem;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .auth-button:hover {
          background-color: #2563eb;
        }
        
        .auth-button:disabled {
          background-color: #93c5fd;
          cursor: not-allowed;
        }
        
        .auth-footer {
          margin-top: 1.5rem;
          text-align: center;
          color: #64748b;
        }
        
        .toggle-link {
          background: none;
          border: none;
          color: #3b82f6;
          padding: 0;
          cursor: pointer;
          font-size: inherit;
        }
        
        .toggle-link:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default Login;