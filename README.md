# Citrak

Citrak is a dynamic web application designed to provide real-time traffic data and insights for urban environments. The application features an interactive frontend that visualizes live traffic conditions, allowing users to navigate through various pages and access essential traffic statistics.

## Features

- **Live Traffic Map**: Displays real-time traffic data using an interactive map interface.
- **User Authentication**: Allows users to register and log in to access personalized features.
- **Traffic Statistics**: Provides detailed statistics on traffic conditions, including congestion levels and location-based data.
- **Responsive Design**: Ensures a seamless experience across different devices.

## Project Structure

```
Citrak
├── backend
│   ├── src
│   │   ├── controllers
│   │   ├── models
│   │   ├── routes
│   │   ├── services
│   │   ├── utils
│   │   ├── config.js
│   │   ├── app.js
│   │   └── server.js
│   ├── package.json
│   └── .env.example
├── frontend
│   ├── public
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── services
│   │   ├── utils
│   │   ├── App.jsx
│   │   ├── index.jsx
│   │   └── styles.css
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm (Node package manager)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/Citrak.git
   ```

2. Navigate to the backend directory and install dependencies:
   ```
   cd Citrak/backend
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env` and fill in the required values.

4. Start the backend server:
   ```
   npm start
   ```

5. Navigate to the frontend directory and install dependencies:
   ```
   cd ../frontend
   npm install
   ```

6. Start the frontend application:
   ```
   npm run dev
   ```

### Usage

- Access the application in your web browser at `http://localhost:3000` (or the port specified in your configuration).
- Use the navigation bar to switch between the Dashboard, Live Map, Settings, and Login pages.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.