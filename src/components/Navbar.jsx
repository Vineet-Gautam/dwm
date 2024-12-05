import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-lg font-bold">Dark Web Monitoring</h1>
        <ul className="flex space-x-6">
          <li><Link to="/" className="hover:text-blue-400">Home</Link></li>
          <li><Link to="/onionscan" className="hover:text-blue-400">Onion Scan</Link></li>
          <li><Link to="/directoryscan" className="hover:text-blue-400">Directory Scan</Link></li>
          <li><Link to="/serverleaksdetector" className="hover:text-blue-400">Server Leaks Detector</Link></li>
        </ul>
      </div>
    </nav>
  );
}
