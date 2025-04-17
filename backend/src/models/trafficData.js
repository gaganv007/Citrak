const mongoose = require('mongoose');

const trafficDataSchema = new mongoose.Schema({
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  speedData: {
    currentSpeed: Number,
    freeFlowSpeed: Number,
    speedLimit: Number,
    units: {
      type: String,
      enum: ['KMH', 'MPH'],
      default: 'KMH'
    }
  },
  congestion: {
    level: {
      type: String,
      enum: ['low', 'moderate', 'heavy', 'severe'],
      required: true
    },
    value: {
      type: Number, // 0-100
      required: true
    }
  },
  roadInfo: {
    name: String,
    type: String,
    direction: String
  },
  incidents: [{
    type: {
      type: String,
      enum: ['accident', 'construction', 'event', 'hazard', 'weatherHazard']
    },
    description: String,
    startTime: Date,
    endTime: Date,
    severity: {
      type: String,
      enum: ['minor', 'moderate', 'major']
    }
  }],
  source: {
    type: String,
    enum: ['tomtom', 'mapbox', 'other'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create geospatial index for location-based queries
trafficDataSchema.index({ location: '2dsphere' });

const TrafficData = mongoose.model('TrafficData', trafficDataSchema);

module.exports = TrafficData;