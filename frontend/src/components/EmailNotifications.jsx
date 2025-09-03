import { useState, useEffect } from 'react';
import axios from 'axios';

function EmailNotifications() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSendTestEmail = async () => {
    if (!email) {
      setMessage('Please enter an email address.');
      return;
    }
    setSending(true);
    setMessage('');
    try {
      // Assuming backend has an endpoint to send test email notifications
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:4000/api/notifications/test-email',
        { email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Test email sent successfully!');
    } catch (error) {
      setMessage('Failed to send test email.');
      console.error(error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-2xl font-bold mb-4">Email Notifications</h2>
      <div className="max-w-md bg-white p-6 rounded shadow">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Enter email to send test notification:
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="user@example.com"
        />
        <button
          onClick={handleSendTestEmail}
          disabled={sending}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
        >
          {sending ? 'Sending...' : 'Send Test Email'}
        </button>
        {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
      </div>
    </div>
  );
}

export default EmailNotifications;
