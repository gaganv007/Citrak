import React, { useState, useEffect } from 'react';
import { authService } from '../services/api';
import { useHistory } from 'react-router-dom';

const Settings = () => {
  const [preferences, setPreferences] = useState({
    defaultLocation: {
      coordinates: [-74.006, 40.7128] // Default NYC
    },
    defaultZoom: 12,
    trafficLayerVisible: true,
    incidentsVisible: true,
    weatherVisible: false,
    theme: 'light'
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const history = useHistory();
  
  useEffect(() => {
    // Load user preferences
    const user = authService.getCurrentUser();
    if (!user) {
      // Redirect to login if not logged in
      history.push('/login');
      return;
    }
    
    if (user.preferences) {
      setPreferences(user.preferences);
    }
  }, [history]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setPreferences(prev => {
      if (type === 'checkbox') {
        return { ...prev, [name]: checked };
      }
      
      if (name === 'lat' || name === 'lng') {
        const coords = [...prev.defaultLocation.coordinates];
        if (name === 'lng') coords[0] = parseFloat(value);
        if (name === 'lat') coords[1] = parseFloat(value);
        
        return {
          ...prev,
          defaultLocation: {
            ...prev.defaultLocation,
            coordinates: coords
          }
        };
      }
      
      if (name === 'defaultZoom') {
        return { ...prev, [name]: parseInt(value) };
      }
      
      return { ...prev, [name]: value };
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });
    
    try {
      await authService.updatePreferences(preferences);
      setMessage({ 
        text: 'Settings updated successfully!', 
        type: 'success' 
      });
    } catch (error) {
      setMessage({ 
        text: 'Failed to update settings: ' + (error.message || 'Unknown error'), 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="settings-container">
      <h1>User Settings</h1>
      
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="settings-form">
        <div className="form-section">
          <h2>Map Preferences</h2>
          
          <div className="form-group">
            <label>Default Location</label>
            <div className="coordinates-group">
              <div className="coordinate">
                <span>Longitude:</span>
                <input
                  type="number"
                  name="lng"
                  value={preferences.defaultLocation.coordinates[0]}
                  onChange={handleChange}
                  step="0.0001"
                />
              </div>
              <div className="coordinate">
                <span>Latitude:</span>
                <input
                  type="number"
                  name="lat"
                  value={preferences.defaultLocation.coordinates[1]}
                  onChange={handleChange}
                  step="0.0001"
                />
              </div>
            </div>
          </div>
          
          <div className="form-group">
            <label>Default Zoom Level</label>
            <input
              type="range"
              name="defaultZoom"
              min="1"
              max="20"
              value={preferences.defaultZoom}
              onChange={handleChange}
            />
            <span>{preferences.defaultZoom}</span>
          </div>
        </div>
        
        <div className="form-section">
          <h2>Display Options</h2>
          
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="trafficLayerVisible"
                checked={preferences.trafficLayerVisible}
                onChange={handleChange}
              />
              Show Traffic Layer
            </label>
          </div>
          
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="incidentsVisible"
                checked={preferences.incidentsVisible}
                onChange={handleChange}
              />
              Show Traffic Incidents
            </label>
          </div>
          
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="weatherVisible"
                checked={preferences.weatherVisible}
                onChange={handleChange}
              />
              Show Weather
            </label>
          </div>
          
          <div className="form-group">
            <label>Theme</label>
            <select 
              name="theme" 
              value={preferences.theme}
              onChange={handleChange}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto (System Default)</option>
            </select>
          </div>
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="save-button"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
      
      <style jsx>{`
        .settings-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
        }
        
        h1 {
          margin-bottom: 1.5rem;
          color: #1e293b;
        }
        
        .message {
          padding: 0.75rem 1rem;
          border-radius: 0.25rem;
          margin-bottom: 1.5rem;
        }
        
        .message.success {
          background-color: #def7ec;
          color: #03543e;
        }
        
        .message.error {
          background-color: #fee2e2;
          color: #b91c1c;
        }
        
        .settings-form {
          background-color: white;
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          padding: 1.5rem;
        }
        
        .form-section {
          margin-bottom: 2rem;
        }
        
        h2 {
          font-size: 1.25rem;
          margin-bottom: 1rem;
          color: #1e293b;
        }
        
        .form-group {
          margin-bottom: 1rem;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }
        
        .form-group input[type="checkbox"] {
          margin-right: 0.5rem;
        }
        
        .form-group input[type="number"],
        .form-group input[type="text"],
        .form-group select {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.25rem;
        }
        
        .coordinates-group {
          display: flex;
          gap: 1rem;
        }
        
        .coordinate {
          flex: 1;
        }
        
        .coordinate span {
          display: block;
          margin-bottom: 0.25rem;
          font-size: 0.875rem;
          color: #64748b;
        }
        
        .form-actions {
          margin-top: 2rem;
          text-align: right;
        }
        
        .save-button {
          background-color: #3b82f6;
          color: white;
          border: none;
          border-radius: 0.25rem;
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .save-button:hover {
          background-color: #2563eb;
        }
        
        .save-button:disabled {
          background-color: #93c5fd;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default Settings;