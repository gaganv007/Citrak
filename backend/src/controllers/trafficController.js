const trafficService = require('../services/trafficService');

// Get traffic flow data for a location
exports.getTrafficData = async (req, res) => {
  try {
    const { lat, lon, radius = 5000 } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }
    
    const trafficData = await trafficService.getTrafficFlowFromTomTom(
      parseFloat(lat),
      parseFloat(lon),
      parseFloat(radius)
    );
    
    // Save data to database
    await trafficService.saveTrafficData(trafficData);
    
    res.json(trafficData);
  } catch (error) {
    console.error('Error in getTrafficData:', error);
    res.status(500).json({ error: 'Failed to fetch traffic data' });
  }
};

// Get traffic incidents for a location
exports.getTrafficIncidents = async (req, res) => {
  try {
    const { lat, lon, radius = 5000 } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }
    
    const incidents = await trafficService.getTrafficIncidentsFromTomTom(
      parseFloat(lat),
      parseFloat(lon),
      parseFloat(radius)
    );
    
    // Save incident data
    for (const incident of incidents) {
      await trafficService.saveTrafficData(incident);
    }
    
    res.json(incidents);
  } catch (error) {
    console.error('Error in getTrafficIncidents:', error);
    res.status(500).json({ error: 'Failed to fetch traffic incidents' });
  }
};

// Get weather data for a location
exports.getWeatherData = async (req, res) => {
  try {
    const { lat, lon } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }
    
    const weatherData = await trafficService.getWeatherData(
      parseFloat(lat),
      parseFloat(lon)
    );
    
    res.json(weatherData);
  } catch (error) {
    console.error('Error in getWeatherData:', error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
};

// Get historical traffic data
exports.getHistoricalTrafficData = async (req, res) => {
  try {
    const { lat, lon, radius = 5000, startDate, endDate, limit = 100 } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }
    
    // Query from database based on location and time range
    const query = {
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lon), parseFloat(lat)]
          },
          $maxDistance: parseFloat(radius)
        }
      }
    };
    
    // Add date range if provided
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }
    
    const historicalData = await trafficService.queryTrafficData(query, parseInt(limit));
    
    res.json(historicalData);
  } catch (error) {
    console.error('Error in getHistoricalTrafficData:', error);
    res.status(500).json({ error: 'Failed to fetch historical traffic data' });
  }
};

// Get traffic statistics
exports.getTrafficStats = async (req, res) => {
  try {
    const { lat, lon, radius = 5000, timeFrame = 'day' } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }
    
    let startDate = new Date();
    
    // Determine time frame for stats
    switch(timeFrame) {
      case 'hour':
        startDate.setHours(startDate.getHours() - 1);
        break;
      case 'day':
        startDate.setDate(startDate.getDate() - 1);
        break;
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      default:
        startDate.setDate(startDate.getDate() - 1); // Default to 1 day
    }
    
    // Calculate statistics from historical data
    const stats = await trafficService.calculateTrafficStats(
      parseFloat(lat),
      parseFloat(lon),
      parseFloat(radius),
      startDate
    );
    
    res.json(stats);
  } catch (error) {
    console.error('Error in getTrafficStats:', error);
    res.status(500).json({ error: 'Failed to fetch traffic statistics' });
  }
};