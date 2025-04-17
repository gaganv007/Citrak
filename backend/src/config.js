module.exports = {
    db: {
        uri: process.env.DB_URI || 'mongodb://localhost:27017/citrak', // Database connection string
    },
    api: {
        trafficApiKey: process.env.TRAFFIC_API_KEY || 'your_traffic_api_key', // API key for traffic data
        trafficApiUrl: process.env.TRAFFIC_API_URL || 'https://api.trafficdata.com', // Base URL for traffic API
    },
    server: {
        port: process.env.PORT || 5000, // Server port
    },
};