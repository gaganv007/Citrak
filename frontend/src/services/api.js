import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api'; // Update with your backend URL

export const fetchTrafficData = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/traffic`);
        return response.data;
    } catch (error) {
        console.error('Error fetching traffic data:', error);
        throw error;
    }
};

export const updateTrafficData = async (data) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/traffic`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating traffic data:', error);
        throw error;
    }
};