import React, { useState, useEffect } from 'react';
import { trafficService } from '../services/api';

const Dashboard = () => {
  const [trafficStats, setTrafficStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Default to NYC coordinates
  const defaultLocation = {
    lat: 40.7128,
    lon: -74.006
  };
  
  useEffect(() => {
    const fetchTrafficStats = async () => {
      try {
        setLoading(true);
        // Fetch traffic stats for the default location
        const stats = await trafficService.getTrafficData(
          defaultLocation.lat,
          defaultLocation.lon,
          5000
        );
        setTrafficStats(stats);
        setError(null);
      } catch (err) {
        console.error('Error fetching traffic stats:', err);
        setError('Failed to load traffic statistics');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTrafficStats();
  }, []);
  
  if (loading) {
    return <div className="loading">Loading traffic data...</div>;
  }
  
  if (error) {
    return <div className="error">{error}</div>;
  }
  
  return (
    <div className="dashboard">
      <h1>Traffic Dashboard</h1>
      
      <div className="dashboard-content">
        <div className="stats-card">
          <h2>Traffic Overview</h2>
          {trafficStats ? (
            <div className="stats-container">
              <p>Data points collected: {trafficStats.length || 0}</p>
              {/* Add more stats visualization here */}
            </div>
          ) : (
            <p>No traffic data available for this location.</p>
          )}
        </div>
        
        <div className="search-card">
          <h2>Search Location</h2>
          <div className="search-container">
            <input 
              type="text" 
              placeholder="Enter location..."
              className="search-input" 
            />
            <button className="search-button">Search</button>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .dashboard {
          padding: 2rem;
        }
        
        h1 {
          margin-bottom: 1.5rem;
          color: #1e293b;
        }
        
        .dashboard-content {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 1.5rem;
        }
        
        .stats-card, .search-card {
          background-color: white;
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          padding: 1.5rem;
        }
        
        h2 {
          margin-top: 0;
          margin-bottom: 1rem;
          color: #1e293b;
          font-size: 1.25rem;
        }
        
        .search-container {
          display: flex;
          gap: 0.5rem;
        }
        
        .search-input {
          flex: 1;
          padding: 0.75rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.25rem;
        }
        
        .search-button {
          background-color: #3b82f6;
          color: white;
          border: none;
          border-radius: 0.25rem;
          padding: 0.75rem 1rem;
          cursor: pointer;
        }
        
        .loading, .error {
          padding: 2rem;
          text-align: center;
        }
        
        .error {
          color: #e53e3e;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;