const axios = require('axios');

const TRAFFIC_API_URL = 'https://api.example.com/traffic'; // Replace with actual traffic API URL

class TrafficService {
    async fetchTrafficData(location) {
        try {
            const response = await axios.get(`${TRAFFIC_API_URL}?location=${location}`);
            return this.processTrafficData(response.data);
        } catch (error) {
            console.error('Error fetching traffic data:', error);
            throw new Error('Could not fetch traffic data');
        }
    }

    processTrafficData(data) {
        return data.map(item => ({
            location: item.location,
            congestionLevel: item.congestionLevel,
            timestamp: new Date(item.timestamp),
        }));
    }

    async updateTrafficData(location, congestionLevel) {
        try {
            const response = await axios.post(`${TRAFFIC_API_URL}/update`, {
                location,
                congestionLevel,
            });
            return response.data;
        } catch (error) {
            console.error('Error updating traffic data:', error);
            throw new Error('Could not update traffic data');
        }
    }
}

module.exports = new TrafficService();