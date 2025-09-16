// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://payment-roster-dashboard-1.onrender.com';

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/api/login`,
  REGISTER: `${API_BASE_URL}/api/register`,
  PAYMENTS: `${API_BASE_URL}/api/payments`,
  USERS: `${API_BASE_URL}/api/users`,
  FORGOT_PASSWORD: `${API_BASE_URL}/api/forgot-password`,
  RESET_PASSWORD: `${API_BASE_URL}/api/reset-password`,
  TEST_SMTP: `${API_BASE_URL}/api/test-smtp`,
};

export default API_BASE_URL;
