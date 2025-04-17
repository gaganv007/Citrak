import React, { useState } from 'react';
import Map from '../components/Map';
import { authService } from '../services/api';

const LiveMap = () => {
  const [mapLocation, setMapLocation] = useState(() => {
    const user = authService.getCurrentUser();
    // Use user preferences or default to NYC
    return user?.preferences?.defaultLocation 
      ? {
          lat: user.preferences.defaultLocation.coordinates[1],
          lng: user.preferences.defaultLocation.coordinates[0],
          zoom: user.preferences.defaultZoom || 12
        }
      : { lat: 40.7128, lng: -74.006, zoom: 12 };
  });
  
  const [showSettings, setShowSettings] = useState(false);
  
  const handleMapMove = (newLocation) => {
    setMapLocation(newLocation);
  };
  
  return (
    <div className="live-map-container">
      <div className="map-controls">
        <button 
          className="settings-toggle"
          onClick={() => setShowSettings(!showSettings)}
        >
          {showSettings ? 'Hide Settings' : 'Show Settings'}
        </button>
        
        {showSettings && (
          <div className="map-settings">
            <h3>Map Settings</h3>
            <div className="setting-group">
              <label>
                <input type="checkbox" defaultChecked={true} />
                Show Traffic
              </label>
            </div>
            <div className="setting-group">
              <label>
                <input type="checkbox" defaultChecked={true} />
                Show Incidents
              </label>
            </div>
            <div className="setting-group">
              <label>
                <input type="checkbox" defaultChecked={false} />
                Show Weather
              </label>
            </div>
          </div>
        )}
      </div>
      
      <div className="map-wrapper">
        <Map centerLocation={mapLocation} onMapMove={handleMapMove} />
      </div>
      
      <style jsx>{`
        .live-map-container {
          position: relative;
          height: calc(100vh - 60px);
        }
        
        .map-controls {
          position: absolute;
          top: 1rem;
          right: 1rem;
          z-index: 10;
        }
        
        .settings-toggle {
          background-color: white;
          border: 1px solid #e2e8f0;
          border-radius: 0.25rem;
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .map-settings {
          margin-top: 0.5rem;
          background-color: white;
          border-radius: 0.25rem;
          padding: 1rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          width: 200px;
        }
        
        .map-settings h3 {
          margin-top: 0;
          margin-bottom: 0.5rem;
          font-size: 1rem;
        }
        
        .setting-group {
          margin-bottom: 0.5rem;
        }
        
        .setting-group label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
        }
        
        .map-wrapper {
          height: 100%;
        }
      `}</style>
    </div>
  );
};

export default LiveMap;