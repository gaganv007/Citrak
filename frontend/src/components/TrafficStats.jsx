import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TrafficStats.css'; // Assuming you have a CSS file for styling

const TrafficStats = () => {
    const [trafficData, setTrafficData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTrafficData = async () => {
            try {
                const response = await axios.get('/api/traffic'); // Adjust the endpoint as necessary
                setTrafficData(response.data);
            } catch (err) {
                setError('Error fetching traffic data');
            } finally {
                setLoading(false);
            }
        };

        fetchTrafficData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="traffic-stats">
            <h2>Traffic Statistics</h2>
            <ul>
                {trafficData.map((data, index) => (
                    <li key={index}>
                        <strong>Location:</strong> {data.location} | 
                        <strong> Congestion Level:</strong> {data.congestionLevel} | 
                        <strong> Timestamp:</strong> {new Date(data.timestamp).toLocaleString()}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TrafficStats;