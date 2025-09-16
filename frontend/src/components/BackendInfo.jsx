import React, { useState, useEffect } from 'react';
import api from '../services/api';

const BackendInfo = () => {
  const [backendUrl, setBackendUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBackendUrl = async () => {
      try {
        const response = await api.get('/api/backend-url');
        setBackendUrl(response.data.backend_url);
      } catch (err) {
        setError('Failed to fetch backend URL');
      } finally {
        setLoading(false);
      }
    };

    fetchBackendUrl();
  }, []);

  if (loading) return <div className="text-center">Loading backend info...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="bg-blue-100 p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-blue-800">Backend API Info</h3>
      <p className="text-blue-600">Connected to: <span className="font-mono">{backendUrl}</span></p>
      <p className="text-sm text-blue-500 mt-2">Your app is now using the Render backend API!</p>
    </div>
  );
};

export default BackendInfo;
