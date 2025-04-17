import React, { useEffect, useState } from 'react';
import { fetchTrafficData } from '../services/api';

const TrafficLayer = () => {
    const [trafficData, setTrafficData] = useState([]);

    useEffect(() => {
        const getTrafficData = async () => {
            try {
                const data = await fetchTrafficData();
                setTrafficData(data);
            } catch (error) {
                console.error("Error fetching traffic data:", error);
            }
        };

        getTrafficData();
        const interval = setInterval(getTrafficData, 60000); // Refresh data every minute

        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    return (
        <div className="traffic-layer">
            {trafficData.map((traffic, index) => (
                <div key={index} className={`traffic-item congestion-${traffic.congestionLevel}`}>
                    <p>Location: {traffic.location}</p>
                    <p>Congestion Level: {traffic.congestionLevel}</p>
                    <p>Timestamp: {new Date(traffic.timestamp).toLocaleTimeString()}</p>
                </div>
            ))}
        </div>
    );
};

export default TrafficLayer;