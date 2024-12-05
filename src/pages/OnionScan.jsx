import React, { useState } from 'react';

export default function OnionScan() {
  const SERVER_URL = 'http://127.0.0.1:5000/';
  const [url, setUrl] = useState('');
  const [taskId, setTaskId] = useState(null);
  const [scanStatus, setScanStatus] = useState('');
  const [reportUrl, setReportUrl] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);

  // Start Nmap scan
  async function startScan() {
    if (!url) {
      setScanStatus('URL is required');
      return;
    }

    setScanStatus('Starting scan...');
    setIsDisabled(true);
    try {
      const response = await fetch(`${SERVER_URL}/nmap_scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target: url }),
      });
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      setTaskId(data.task_id);
      setScanStatus('Scan started');
    } catch (error) {
      setScanStatus(`Error: ${error.message}`);
    } finally {
      setIsDisabled(false);
    }
  }

  // Check scan status
  async function checkStatus() {
    if (!taskId) {
      setScanStatus('No scan in progress');
      return;
    }

    setScanStatus('Checking scan status...');
    try {
      const response = await fetch(`${SERVER_URL}/nmap_report/${taskId}`);
      if (!response.ok) throw new Error(`Error: ${response.status}`);

      const blob = await response.blob();
      const fileUrl = window.URL.createObjectURL(blob);
      const fileName = `${taskId}_nmap_report.txt`;

      setReportUrl(fileUrl);
      setScanStatus('Scan completed. Report ready for download.');
    } catch (error) {
      setScanStatus(`Error: ${error.message}`);
    }
  }

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-gray-800 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Nmap Scan Control</h1>
      <div className="flex flex-col gap-4 w-full max-w-md mb-6">
        {/* URL Input and Start Scan Button */}
        <input
          type="text"
          className="bg-gray-700 text-white border border-gray-600 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button
          onClick={startScan}
          className={`bg-blue-500 px-6 py-2 rounded ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isDisabled}
        >
          {isDisabled ? 'Starting Scan...' : 'Start Scan'}
        </button>
      </div>

      {/* Scan Status */}
      {scanStatus && (
        <div className="mt-8 text-center">
          <p className="mb-2">{scanStatus}</p>
        </div>
      )}

      {/* Check Status Button */}
      <div className="mt-4">
        <button
          onClick={checkStatus}
          className="bg-yellow-500 px-6 py-2 rounded"
          disabled={isDisabled}
        >
          Check Scan Status
        </button>
      </div>

      {/* Download Report Button */}
      {reportUrl && (
        <div className="mt-8 text-center">
          <p className="mb-2">Scan completed. Click below to download the report:</p>
          <a href={reportUrl} download={`${taskId}_nmap_report.txt`}>
            <button className="bg-green-500 px-6 py-2 rounded">
              Download Report
            </button>
          </a>
        </div>
      )}

      <div className="mt-auto text-center pt-8 border-t border-gray-700">
        <h2 className="text-xl font-semibold mb-4">About This Project</h2>
        <p>
          This tool allows users to initiate and monitor Nmap scans on specified URLs. You can start a scan, check its status, and download the report once the scan is completed.
        </p>
      </div>
    </div>
  );
}
