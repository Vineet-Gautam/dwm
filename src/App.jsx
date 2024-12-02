import React, { useState } from 'react';

export default function App() {
  const SERVER_URL = 'http://192.168.153.13:5000';
  const [csvUrl, setCsvUrl] = useState(null);
  const [fileSize, setFileSize] = useState(null);
  const [loadingForum, setLoadingForum] = useState(null); 
  const [isDisabled, setIsDisabled] = useState(false); 

  async function startMonitoringDread() {
    setLoadingForum('dread'); 
    setIsDisabled(true); 
    try {
      const response = await fetch(`${SERVER_URL}/start_scraping`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ forum: 'dread' }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Dread scraping started:', data);
    } catch (error) {
      console.error('Error starting Dread scraping:', error);
    }
  }

  async function startMonitoringCryptBB() {
    setLoadingForum('cryptbb'); 
    setIsDisabled(true); 
    try {
      const response = await fetch(`${SERVER_URL}/start_scraping`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ forum: 'cryptbb' }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      console.log('CryptBB scraping started:', data);
    } catch (error) {
      console.error('Error starting CryptBB scraping:', error);
    }
  }

  async function stopMonitoring() {
    try {
      const response = await fetch(`${SERVER_URL}/stop_scraping`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const size = (blob.size / 1024).toFixed(2); 
      setFileSize(size);
      setCsvUrl(url);
      console.log('CSV file ready for download.');
    } catch (error) {
      console.error('Error stopping scraping:', error);
    } finally {
      setLoadingForum(null);
      setIsDisabled(false); 
    }
  }

  function handleDownload() {
    if (csvUrl) {
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = csvUrl;
      a.download = 'output.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(csvUrl); 
      setCsvUrl(null); 
      setFileSize(null); 
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-800 text-white p-8">
      <h1 className="text-3xl mb-8 font-bold">Scraping Control</h1>
      <div className="flex flex-col gap-4">
        <button
          onClick={startMonitoringDread}
          className={`bg-blue-500 text-white px-4 py-2 rounded ${loadingForum === 'dread' ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isDisabled && loadingForum !== 'dread'}
        >
          {loadingForum === 'dread' ? 'Loading...' : 'Start Monitoring Dread'}
        </button>
        <button
          onClick={startMonitoringCryptBB}
          className={`bg-purple-500 text-white px-4 py-2 rounded ${loadingForum === 'cryptbb' ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isDisabled && loadingForum !== 'cryptbb'}
        >
          {loadingForum === 'cryptbb' ? 'Loading...' : 'Start Monitoring CryptBB'}
        </button>
        <button
          onClick={stopMonitoring}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Stop Monitoring
        </button>
      </div>
      {csvUrl && (
        <div className="mt-8">
          <p className="mb-2">CSV file is ready for download:</p>
          <p className="mb-2">File Size: {fileSize} KB</p>
          <button
            onClick={handleDownload}
            className="bg-gray-500 px-4 py-2 rounded"
          >
            Download CSV
          </button>
        </div>
      )}
      <div className="mt-8 text-center">
        <h2 className="text-xl mb-4">About the Forums</h2>
        <p className="mb-2">
          <strong>Dread Forum:</strong> A popular forum for discussing various topics related to the dark web, including news, updates, and resources for users interested in exploring hidden services.
        </p>
        <p className="mb-2">
          <strong>CryptBB:</strong> A forum focused on cryptocurrencies and blockchain technology, where users share insights, trading tips, and information about different coins and tokens.
        </p>
        <p className="mb-2">
          The data we are scraping includes posts, comments, user interactions, and metadata to provide insights into trends and discussions within these communities.
        </p>
      </div>
    </div>
  );
}
