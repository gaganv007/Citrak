import { useEffect, useState } from 'react';
import { trafficService } from '../services/api';

const TrafficLayer = ({ map, showIncidents }) => {
  const [trafficData, setTrafficData] = useState(null);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch traffic data when map moves
  useEffect(() => {
    if (!map) return;
    
    const fetchTrafficData = async () => {
      try {
        setLoading(true);
        const center = map.getCenter();
        const zoom = map.getZoom();
        
        // Calculate radius based on zoom level (closer zoom = smaller radius)
        const radius = Math.max(5000 / (zoom / 10), 1000);
        
        // Fetch traffic flow data
        const data = await trafficService.getTrafficData(
          center.lat,
          center.lng,
          radius
        );
        
        setTrafficData(data);
        setError(null);
        
        // Also fetch incidents if enabled
        if (showIncidents) {
          const incidentData = await trafficService.getTrafficIncidents(
            center.lat,
            center.lng,
            radius
          );
          setIncidents(incidentData);
        }
      } catch (err) {
        console.error('Error fetching traffic data:', err);
        setError('Failed to load traffic data');
      } finally {
        setLoading(false);
      }
    };
    
    // Fetch initial data
    fetchTrafficData();
    
    // Add listener for map movements
    const updateTraffic = () => {
      // Don't update while actively dragging the map
      if (map.isMoving()) return;
      fetchTrafficData();
    };
    
    map.on('moveend', updateTraffic);
    
    // Cleanup
    return () => {
      map.off('moveend', updateTraffic);
      // Remove any added sources and layers
      if (map.getSource('traffic-flow')) {
        map.removeLayer('traffic-flow-layer');
        map.removeSource('traffic-flow');
      }
      
      if (map.getSource('traffic-incidents')) {
        map.removeLayer('traffic-incidents-layer');
        map.removeSource('traffic-incidents');
      }
    };
  }, [map, showIncidents]);

  // Add traffic data to map
  useEffect(() => {
    if (!map || !trafficData || trafficData.length === 0) return;
    
    // Create GeoJSON from traffic data
    const trafficGeoJSON = {
      type: 'FeatureCollection',
      features: trafficData.map(item => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: item.location.coordinates
        },
        properties: {
          congestionLevel: item.congestion.level,
          congestionValue: item.congestion.value,
          currentSpeed: item.speedData?.currentSpeed,
          roadName: item.roadInfo?.name
        }
      }))
    };
    
    // Add or update source
    if (map.getSource('traffic-flow')) {
      map.getSource('traffic-flow').setData(trafficGeoJSON);
    } else {
      // Add new source and layer
      map.addSource('traffic-flow', {
        type: 'geojson',
        data: trafficGeoJSON
      });
      
      // Add traffic flow layer
      map.addLayer({
        id: 'traffic-flow-layer',
        type: 'circle',
        source: 'traffic-flow',
        paint: {
          'circle-radius': [
            'interpolate', ['linear'], ['zoom'],
            10, 2,
            15, 6
          ],
          'circle-color': [
            'match', ['get', 'congestionLevel'],
            'low', '#4CAF50',
            'moderate', '#FFC107',
            'heavy', '#FF5722',
            'severe', '#F44336',
            '#BBBBBB' // default
          ],
          'circle-opacity': 0.7,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#FFFFFF'
        }
      });
      
      // Add click interaction for traffic points
      map.on('click', 'traffic-flow-layer', (e) => {
        const { properties } = e.features[0];
        
        new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(`
            <div class="popup-content">
              <h3>${properties.roadName || 'Road'}</h3>
              <p>Congestion: <strong>${properties.congestionLevel}</strong></p>
              <p>Current Speed: <strong>${properties.currentSpeed || 'N/A'} km/h</strong></p>
            </div>
          `)
          .addTo(map);
      });
      
      // Change cursor on hover
      map.on('mouseenter', 'traffic-flow-layer', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      
      map.on('mouseleave', 'traffic-flow-layer', () => {
        map.getCanvas().style.cursor = '';
      });
    }
  }, [map, trafficData]);

  // Add incidents to map
  useEffect(() => {
    if (!map || !showIncidents || incidents.length === 0) return;
    
    // Create GeoJSON from incidents data
    const incidentsGeoJSON = {
      type: 'FeatureCollection',
      features: incidents.map(item => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: item.location.coordinates
        },
        properties: {
          type: item.incidents[0]?.type || 'hazard',
          description: item.incidents[0]?.description || '',
          severity: item.incidents[0]?.severity || 'minor',
          roadName: item.roadInfo?.name
        }
      }))
    };
    
    // Add or update source
    if (map.getSource('traffic-incidents')) {
      map.getSource('traffic-incidents').setData(incidentsGeoJSON);
    } else {
      // Add new source and layer
      map.addSource('traffic-incidents', {
        type: 'geojson',
        data: incidentsGeoJSON
      });
      
      // Add incidents layer
      map.addLayer({
        id: 'traffic-incidents-layer',
        type: 'symbol',
        source: 'traffic-incidents',
        layout: {
          'icon-image': [
            'match', ['get', 'type'],
            'accident', 'car-accident',
            'construction', 'construction',
            'weatherHazard', 'cloud-rain',
            'hazard', 'warning-sign',
            'warning-sign' // default
          ],
          'icon-size': 1,
          'icon-allow-overlap': true
        }
      });
      
      // Add click interaction for incidents
      map.on('click', 'traffic-incidents-layer', (e) => {
        const { properties } = e.features[0];
        
        new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(`
            <div class="popup-content">
              <h3>${properties.type.toUpperCase()}</h3>
              <p>${properties.description}</p>
              <p>Location: <strong>${properties.roadName || 'Unknown road'}</strong></p>
              <p>Severity: <strong>${properties.severity}</strong></p>
            </div>
          `)
          .addTo(map);
      });
      
      // Change cursor on hover
      map.on('mouseenter', 'traffic-incidents-layer', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      
      map.on('mouseleave', 'traffic-incidents-layer', () => {
        map.getCanvas().style.cursor = '';
      });
    }
  }, [map, incidents, showIncidents]);

  // Display loading or error
  if (loading || error) {
    return (
      <div className="traffic-overlay">
        {loading && <p>Loading traffic data...</p>}
        {error && <p className="error">{error}</p>}
        
        <style jsx>{`
          .traffic-overlay {
            position: absolute;
            top: 20px;
            left: 20px;
            background: rgba(255, 255, 255, 0.8);
            padding: 10px 15px;
            border-radius: 4px;
            z-index: 1;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
          }
          
          .error {
            color: #f44336;
          }
        `}</style>
      </div>
    );
  }
  
  return null; // No UI needed when data is successfully loaded
};

export default TrafficLayer;