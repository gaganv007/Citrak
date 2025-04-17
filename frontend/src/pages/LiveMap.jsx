import React, { useEffect, useState } from 'react';
import Map from '../components/Map';
import TrafficStats from '../components/TrafficStats';
import { fetchTrafficData } from '../services/api';

const LiveMap = () => {
    const [trafficData, setTrafficData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getTrafficData = async () => {
            try {
                const data = await fetchTrafficData();
                setTrafficData(data);
            } catch (error) {
                console.error("Error fetching traffic data:", error);
            } finally {
                setLoading(false);
            }
        };

        getTrafficData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="live-map">
            <h1>Live Traffic Map</h1>
            <Map trafficData={trafficData} />
            <TrafficStats trafficData={trafficData} />
        </div>
    );
};

export default LiveMap;