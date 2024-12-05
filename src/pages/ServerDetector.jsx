import React, { useState } from 'react';

export default function ServerDetector() {
  const SERVER_URL = 'http://192.168.252.13:5000/server_leak'; 
  const [targetUrl, setTargetUrl] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    setResponseData(null);

    try {
      const response = await fetch(SERVER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target_url: targetUrl }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      setResponseData(data);
    } catch (err) {
      setError('Failed to fetch results. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-gray-800 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Server Leaks Detector</h1>
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6 w-full max-w-md">
        <input
          type="url"
          placeholder="Enter URL"
          value={targetUrl}
          onChange={(e) => setTargetUrl(e.target.value)}
          className="w-full px-4 py-2 rounded bg-gray-700 text-white"
          required
        />
        <button
          type="submit"
          className={`w-full px-4 py-2 rounded bg-blue-500 text-white text-center ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={loading}
        >
          {loading ? 'Scanning...' : 'Submit'}
        </button>
      </form>

      {responseData && (
        <div className="mt-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Results</h2>
          <p className="mb-2">
            <strong>Status:</strong> {responseData.status}
          </p>
          <p className="mb-2">
            <strong>Results:</strong> {responseData.results}
          </p>
        </div>
      )}

      {error && (
        <div className="mt-8 text-center text-red-500">
          <p>{error}</p>
        </div>
      )}

      <div className="mt-auto text-center pt-8 border-t border-gray-700">
        <h2 className="text-xl font-semibold mb-4">About Server Leak Detection</h2>
        <p>
          This tool scans the provided URL to detect potential server leaks, security issues, and misconfigurations.
        </p>
        <p>
          Enter a valid URL above to initiate a scan and receive detailed results about the server's status.
        </p>
      </div>
    </div>
  );
}
