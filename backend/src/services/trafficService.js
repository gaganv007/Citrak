const axios = require('axios');
const config = require('../config');
const TrafficData = require('../models/trafficData');

class TrafficService {
  
  // Get traffic flow data from TomTom API
  async getTrafficFlowFromTomTom(lat, lon, radius = 5000) {
    try {
      const response = await axios.get(`${config.externalApis.tomtom.baseUrl}4/flowSegmentData/absolute/10/json`, {
        params: {
          point: `${lat},${lon}`,
          radius,
          unit: 'KMPH',
          key: config.externalApis.tomtom.apiKey
        }
      });
      
      return this._processTomTomFlowData(response.data);
    } catch (error) {
      console.error('Error fetching TomTom traffic flow data:', error);
      throw new Error('Failed to fetch traffic flow data');
    }
  }
  
  // Get traffic incidents from TomTom API
  async getTrafficIncidentsFromTomTom(lat, lon, radius = 5000) {
    try {
      const response = await axios.get(`${config.externalApis.tomtom.baseUrl}4/incidentDetails/s3/json`, {
        params: {
          point: `${lat},${lon}`,
          radius,
          key: config.externalApis.tomtom.apiKey
        }
      });
      
      return this._processTomTomIncidentData(response.data);
    } catch (error) {
      console.error('Error fetching TomTom traffic incidents:', error);
      throw new Error('Failed to fetch traffic incidents');
    }
  }
  
  // Get weather data from OpenWeatherMap
  async getWeatherData(lat, lon) {
    try {
      const response = await axios.get(`${config.externalApis.openWeatherMap.baseUrl}weather`, {
        params: {
          lat,
          lon,
          appid: config.externalApis.openWeatherMap.apiKey,
          units: 'metric'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw new Error('Failed to fetch weather data');
    }
  }
  
  // Save traffic data to database
  async saveTrafficData(trafficData) {
    try {
      const newTrafficData = new TrafficData(trafficData);
      return await newTrafficData.save();
    } catch (error) {
      console.error('Error saving traffic data:', error);
      throw new Error('Failed to save traffic data');
    }
  }
  
  // Query traffic data by location
  async getTrafficDataByLocation(lat, lon, radius = 5000, limit = 50) {
    try {
      return await TrafficData.find({
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [lon, lat]
            },
            $maxDistance: radius
          }
        }
      })
      .sort({ timestamp: -1 })
      .limit(limit);
    } catch (error) {
      console.error('Error querying traffic data:', error);
      throw new Error('Failed to query traffic data');
    }
  }
  
  // Process TomTom flow data
  _processTomTomFlowData(data) {
    // Extract and transform TomTom flow data into our schema format
    if (!data || !data.flowSegmentData) {
      return null;
    }
    
    const flow = data.flowSegmentData;
    
    return {
      location: {
        coordinates: [flow.coordinates.longitude, flow.coordinates.latitude]
      },
      speedData: {
        currentSpeed: flow.currentSpeed,
        freeFlowSpeed: flow.freeFlowSpeed,
        speedLimit: flow.speedLimit || null,
        units: flow.currentSpeedUnit === 'KMH' ? 'KMH' : 'MPH'
      },
      congestion: {
        level: this._getCongestionLevel(flow.currentSpeed, flow.freeFlowSpeed),
        value: flow.congestionLevel || 0
      },
      roadInfo: {
        name: flow.roadName || '',
        type: flow.roadType || '',
        direction: flow.roadDirection || ''
      },
      source: 'tomtom',
      timestamp: new Date()
    };
  }
  
  // Process TomTom incident data
  _processTomTomIncidentData(data) {
    if (!data || !data.incidents || !data.incidents.length) {
      return [];
    }
    
    return data.incidents.map(incident => {
      return {
        location: {
          coordinates: [
            incident.geometry.coordinates[0][0],
            incident.geometry.coordinates[0][1]
          ]
        },
        roadInfo: {
          name: incident.properties.roadName || '',
        },
        incidents: [{
          type: this._mapIncidentType(incident.properties.iconCategory),
          description: incident.properties.description || '',
          startTime: new Date(incident.properties.startTime),
          endTime: incident.properties.endTime ? new Date(incident.properties.endTime) : null,
          severity: this._mapSeverity(incident.properties.magnitudeOfDelay)
        }],
        source: 'tomtom',
        timestamp: new Date()
      };
    });
  }
  
  // Map congestion level
  _getCongestionLevel(currentSpeed, freeFlowSpeed) {
    if (!currentSpeed || !freeFlowSpeed) return 'moderate';
    
    const ratio = currentSpeed / freeFlowSpeed;
    
    if (ratio > 0.75) return 'low';
    if (ratio > 0.5) return 'moderate';
    if (ratio > 0.25) return 'heavy';
    return 'severe';
  }
  
  // Map incident type
  _mapIncidentType(iconCategory) {
    const typeMap = {
      'accident': 'accident',
      'construction': 'construction',
      'hazard': 'hazard',
      'weatherHazard': 'weatherHazard',
      'event': 'event'
    };
    
    return typeMap[iconCategory] || 'hazard';
  }
  
  // Map severity
  _mapSeverity(magnitude) {
    if (!magnitude) return 'minor';
    
    if (magnitude < 4) return 'minor';
    if (magnitude < 8) return 'moderate';
    return 'major';
  }
  
  // Query traffic data with custom query
  async queryTrafficData(query, limit = 100) {
    try {
      return await TrafficData.find(query)
        .sort({ timestamp: -1 })
        .limit(limit);
    } catch (error) {
      console.error('Error querying traffic data:', error);
      throw new Error('Failed to query traffic data');
    }
  }
  
  // Calculate traffic statistics
  async calculateTrafficStats(lat, lon, radius, startDate) {
    try {
      const query = {
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [lon, lat]
            },
            $maxDistance: radius
          }
        },
        timestamp: { $gte: startDate }
      };
      
      const data = await TrafficData.find(query);
      
      // Initialize stats object
      const stats = {
        totalDataPoints: data.length,
        congestionLevels: {
          low: 0,
          moderate: 0,
          heavy: 0,
          severe: 0
        },
        averageSpeeds: {
          overall: 0,
          byRoadType: {}
        },
        incidents: {
          total: 0,
          byType: {}
        },
        timeAnalysis: {
          hourly: Array(24).fill(0)
        }
      };
      
      // Process data to calculate statistics
      let totalSpeed = 0;
      let speedCount = 0;
      
      for (const item of data) {
        // Count congestion levels
        if (item.congestion && item.congestion.level) {
          stats.congestionLevels[item.congestion.level]++;
        }
        
        // Calculate average speeds
        if (item.speedData && item.speedData.currentSpeed) {
          totalSpeed += item.speedData.currentSpeed;
          speedCount++;
          
          // By road type
          if (item.roadInfo && item.roadInfo.type) {
            const roadType = item.roadInfo.type;
            if (!stats.averageSpeeds.byRoadType[roadType]) {
              stats.averageSpeeds.byRoadType[roadType] = {
                total: 0,
                count: 0
              };
            }
            
            stats.averageSpeeds.byRoadType[roadType].total += item.speedData.currentSpeed;
            stats.averageSpeeds.byRoadType[roadType].count++;
          }
        }
        
        // Count incidents
        if (item.incidents && item.incidents.length > 0) {
          stats.incidents.total += item.incidents.length;
          
          for (const incident of item.incidents) {
            if (incident.type) {
              if (!stats.incidents.byType[incident.type]) {
                stats.incidents.byType[incident.type] = 0;
              }
              stats.incidents.byType[incident.type]++;
            }
          }
        }
        
        // Time analysis
        if (item.timestamp) {
          const hour = new Date(item.timestamp).getHours();
          stats.timeAnalysis.hourly[hour]++;
        }
      }
      
      // Calculate final averages
      if (speedCount > 0) {
        stats.averageSpeeds.overall = totalSpeed / speedCount;
      }
      
      // Calculate averages for each road type
      for (const roadType in stats.averageSpeeds.byRoadType) {
        const data = stats.averageSpeeds.byRoadType[roadType];
        if (data.count > 0) {
          stats.averageSpeeds.byRoadType[roadType] = data.total / data.count;
        }
      }
      
      return stats;
    } catch (error) {
      console.error('Error calculating traffic stats:', error);
      throw new Error('Failed to calculate traffic statistics');
    }
  }
}

module.exports = new TrafficService();