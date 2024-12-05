import React, { useState } from 'react';

export default function Home() {
  const SERVER_URL = 'http://192.168.153.13:5000';
  const [csvUrl, setCsvUrl] = useState(null);
  const [fileSize, setFileSize] = useState(null);
  const [loadingForum, setLoadingForum] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);

  async function startMonitoring(forum) {
    setLoadingForum(forum);
    setIsDisabled(true);
    try {
      const response = await fetch(`${SERVER_URL}/start_scraping`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ forum }),
      });
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      console.log(`${forum} scraping started:`, data);
    } catch (error) {
      console.error(`Error starting ${forum} scraping:`, error);
    }
  }

  async function stopMonitoring() {
    try {
      const response = await fetch(`${SERVER_URL}/stop_scraping`, { method: 'GET' });
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const size = (blob.size / 1024).toFixed(2);
      setFileSize(size);
      setCsvUrl(url);
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
    <div className="flex flex-col items-center justify-between min-h-screen bg-gray-800 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Scraping Control</h1>
      <div className="flex flex-col gap-4">
        <button
          onClick={() => startMonitoring('dread')}
          className={`bg-blue-500 px-6 py-2 rounded ${loadingForum === 'dread' ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isDisabled && loadingForum !== 'dread'}
        >
          {loadingForum === 'dread' ? 'Loading...' : 'Start Monitoring Dread'}
        </button>
        <button
          onClick={() => startMonitoring('cryptbb')}
          className={`bg-purple-500 px-6 py-2 rounded ${loadingForum === 'cryptbb' ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isDisabled && loadingForum !== 'cryptbb'}
        >
          {loadingForum === 'cryptbb' ? 'Loading...' : 'Start Monitoring CryptBB'}
        </button>
        <button
          onClick={stopMonitoring}
          className="bg-green-500 px-6 py-2 rounded"
        >
          Stop Monitoring
        </button>
      </div>
      {csvUrl && (
        <div className="mt-8 text-center">
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
      <div className="mt-auto text-center pt-8 border-t border-gray-700">
        <h2 className="text-xl font-semibold mb-4">About This Project</h2>
        <p className="mb-2">
          <strong>Dread Forum:</strong> A popular dark web forum for discussions about hidden services, security, and anonymous communication.
        </p>
        <p className="mb-2">
          <strong>CryptBB Forum:</strong> A specialized forum for cryptocurrency and blockchain technology enthusiasts, featuring insights, tips, and trading discussions.
        </p>
        <p>
          This project scrapes data from these forums to analyze trends, discussions, and potential security threats. The collected data provides valuable insights into the dark web ecosystem.
        </p>
      </div>
    </div>
  );
}
