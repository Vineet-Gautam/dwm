// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import OnionScan from './pages/OnionScan';
import DirectoryScan from './pages/DirectoryScan';
import ServerDetector from './pages/ServerDetector';

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/onionscan" element={<OnionScan />} />
        <Route path="/directoryscan" element={<DirectoryScan />} />
        <Route path="/serverleaksdetector" element={<ServerDetector />} />
      </Routes>
    </Router>
  );
}
