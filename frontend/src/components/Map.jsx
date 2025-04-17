import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const Map = () => {
    const [trafficData, setTrafficData] = useState([]);

    useEffect(() => {
        const fetchTrafficData = async () => {
            try {
                const response = await fetch('/api/traffic');
                const data = await response.json();
                setTrafficData(data);
            } catch (error) {
                console.error('Error fetching traffic data:', error);
            }
        };

        fetchTrafficData();
        const interval = setInterval(fetchTrafficData, 5000); // Fetch data every 5 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '100vh', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {trafficData.map((traffic, index) => (
                <Marker key={index} position={[traffic.location.lat, traffic.location.lng]} icon={L.icon({ iconUrl: '/path/to/icon.png' })}>
                    <Popup>
                        <div>
                            <h3>Traffic Info</h3>
                            <p>Congestion Level: {traffic.congestionLevel}</p>
                            <p>Timestamp: {new Date(traffic.timestamp).toLocaleString()}</p>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default Map;