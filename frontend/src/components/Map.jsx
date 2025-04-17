import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import TrafficLayer from './TrafficLayer';
import { authService } from '../services/api';

// Set Mapbox access token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const Map = ({ centerLocation, onMapMove }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapReady, setMapReady] = useState(false);
  const [zoom, setZoom] = useState(12);
  const [userPreferences, setUserPreferences] = useState(() => {
    const user = authService.getCurrentUser();
    return user?.preferences || {
      defaultLocation: { coordinates: [-74.006, 40.7128] }, // NYC default
      defaultZoom: 12,
      trafficLayerVisible: true,
      incidentsVisible: true,
      weatherVisible: false,
      theme: 'light'
    };
  });

  // Initialize map
  useEffect(() => {
    if (map.current) return; // Map already initialized
    
    // Use center location from props or user preferences
    const center = centerLocation 
      ? [centerLocation.lng, centerLocation.lat]
      : userPreferences.defaultLocation.coordinates;
    
    // Create map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: userPreferences.theme === 'dark' 
        ? 'mapbox://styles/mapbox/dark-v10' 
        : 'mapbox://styles/mapbox/streets-v11',
      center: center,
      zoom: centerLocation?.zoom || userPreferences.defaultZoom
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    
    // Add geolocate control
    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
      }),
      'top-right'
    );

    // Map move event
    map.current.on('moveend', () => {
      const center = map.current.getCenter();
      const zoom = map.current.getZoom();
      
      if (onMapMove) {
        onMapMove({
          lat: center.lat,
          lng: center.lng,
          zoom
        });
      }
      
      setZoom(zoom);
    });

    // Map load event
    map.current.on('load', () => {
      setMapReady(true);
    });

    // Cleanup
    return () => map.current?.remove();
  }, []);

  // Update map when centerLocation changes
  useEffect(() => {
    if (!map.current || !centerLocation) return;
    
    map.current.flyTo({
      center: [centerLocation.lng, centerLocation.lat],
      zoom: centerLocation.zoom || zoom,
      essential: true
    });
  }, [centerLocation]);

  // Update map style when theme changes
  useEffect(() => {
    if (!map.current) return;
    
    const style = userPreferences.theme === 'dark' 
      ? 'mapbox://styles/mapbox/dark-v10' 
      : 'mapbox://styles/mapbox/streets-v11';
    
    map.current.setStyle(style);
  }, [userPreferences.theme]);

  return (
    <div className="map-container">
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
      
      {mapReady && userPreferences.trafficLayerVisible && (
        <TrafficLayer 
          map={map.current}
          showIncidents={userPreferences.incidentsVisible}
        />
      )}
      
      <style jsx>{`
        .map-container {
          position: relative;
          width: 100%;
          height: 100vh;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

export default Map;