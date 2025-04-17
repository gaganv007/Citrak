const mongoose = require('mongoose');

const trafficDataSchema = new mongoose.Schema({
    location: {
        type: String,
        required: true
    },
    congestionLevel: {
        type: String,
        enum: ['low', 'moderate', 'high', 'severe'],
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const TrafficData = mongoose.model('TrafficData', trafficDataSchema);

module.exports = TrafficData;