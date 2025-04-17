require('dotenv').config();

module.exports = {
  database: {
    url: process.env.DATABASE_URL || 'mongodb://localhost:27017/citrak_db',
  },
  server: {
    port: process.env.PORT || 3000,
  },
  api: {
    key: process.env.API_KEY,
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'f68d4b3e9c7a2105e8bf1d6279c54a23',
  },
  environment: process.env.NODE_ENV || 'development',
  externalApis: {
    tomtom: {
      apiKey: process.env.TOMTOM_API_KEY,
      baseUrl: 'https://api.tomtom.com/traffic/services/',
    },
    mapbox: {
      accessToken: process.env.MAPBOX_ACCESS_TOKEN,
    },
    openWeatherMap: {
      apiKey: process.env.OPENWEATHERMAP_API_KEY,
      baseUrl: 'https://api.openweathermap.org/data/2.5/',
    }
  }
};