'use client';

import { useEffect, useState } from 'react';

export default function TestPage() {
  const [backendStatus, setBackendStatus] = useState('checking...');
  const [frontendStatus, setFrontendStatus] = useState('loading...');

  useEffect(() => {
    // Test backend connection
    fetch('http://127.0.0.1:8000/api/products/categories/')
      .then(res => {
        if (res.ok) {
          setBackendStatus('Backend connected successfully!');
        } else {
          setBackendStatus(`Backend error: ${res.status}`);
        }
      })
      .catch(err => {
        setBackendStatus(`Backend connection failed: ${err.message}`);
      });

    // Test frontend
    setFrontendStatus('Frontend is working!');
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Connection Test Page</h1>
      
      <div className="space-y-4">
        <div className="p-4 bg-gray-100 rounded">
          <h2 className="font-semibold">Frontend Status:</h2>
          <p className="text-green-600">{frontendStatus}</p>
        </div>

        <div className="p-4 bg-gray-100 rounded">
          <h2 className="font-semibold">Backend Status:</h2>
          <p className={backendStatus.includes('successfully') ? 'text-green-600' : 'text-red-600'}>
            {backendStatus}
          </p>
        </div>

        <div className="mt-4">
          <a href="/" className="text-pink-600 hover:underline">
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
