import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import LiveMap from './pages/LiveMap';
import Settings from './pages/Settings';
import Login from './pages/Login';
import './styles.css';

const App = () => {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>s
          <Route path="/" element={<Dashboard />} />
          <Route path="/live-map" element={<LiveMap />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;