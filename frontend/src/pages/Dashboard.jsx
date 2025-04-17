import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import TrafficStats from '../components/TrafficStats';
import Map from '../components/Map';
import { fetchTrafficData } from '../services/api';

const Dashboard = () => {
    const [trafficData, setTrafficData] = useState([]);

    useEffect(() => {
        const getTrafficData = async () => {
            try {
                const data = await fetchTrafficData();
                setTrafficData(data);
            } catch (error) {
                console.error('Error fetching traffic data:', error);
            }
        };

        getTrafficData();
        const interval = setInterval(getTrafficData, 60000); // Refresh data every minute

        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <Navbar />
            <h1>Dashboard</h1>
            <TrafficStats data={trafficData} />
            <Map data={trafficData} />
        </div>
    );
};

export default Dashboard;