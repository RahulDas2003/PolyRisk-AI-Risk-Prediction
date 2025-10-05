// API Configuration for different environments
const isDevelopment = process.env.NODE_ENV === 'development';

// Backend API URLs - Now using Vercel API routes
export const API_CONFIG = {
  // Main API (Vercel API route)
  MAIN_API_URL: isDevelopment 
    ? 'http://localhost:3000/api'
    : '/api',
  
  // Analytics API (Vercel API route)
  ANALYTICS_API_URL: isDevelopment
    ? 'http://localhost:3000/api'
    : '/api',
  
  // Chatbot API (Vercel API route)
  CHATBOT_API_URL: isDevelopment
    ? 'http://localhost:3000/api'
    : '/api',
};

// API Endpoints
export const API_ENDPOINTS = {
  // Main API endpoints (Vercel API routes)
  SAVE_PATIENT: `${API_CONFIG.MAIN_API_URL}/patient`,
  ANALYZE_PATIENT: `${API_CONFIG.MAIN_API_URL}/patient`,
  GET_PATIENTS: `${API_CONFIG.MAIN_API_URL}/patient`,
  GET_PATIENT: `${API_CONFIG.MAIN_API_URL}/patient`,
  DELETE_PATIENT: `${API_CONFIG.MAIN_API_URL}/patient`,
  GET_STATS: `${API_CONFIG.MAIN_API_URL}/patient`,
  
  // Analytics API endpoints (Vercel API routes)
  DASHBOARD_METRICS: `${API_CONFIG.ANALYTICS_API_URL}/analytics`,
  LIVE_ANALYTICS: `${API_CONFIG.ANALYTICS_API_URL}/analytics`,
  
  // Chatbot API endpoints (Vercel API routes)
  CHAT_MESSAGE: `${API_CONFIG.CHATBOT_API_URL}/chatbot`,
  CHAT_SUGGESTIONS: `${API_CONFIG.CHATBOT_API_URL}/chatbot`,
  CHAT_HISTORY: `${API_CONFIG.CHATBOT_API_URL}/chatbot`,
};

// CORS Configuration
export const CORS_CONFIG = {
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

// Error handling
export const handleApiError = (error: any, endpoint: string) => {
  console.error(`API Error for ${endpoint}:`, error);
  return {
    success: false,
    error: error.message || 'Unknown error occurred',
    endpoint,
  };
};

// Success response handler
export const handleApiSuccess = (data: any, endpoint: string) => {
  console.log(`API Success for ${endpoint}:`, data);
  return {
    success: true,
    data,
    endpoint,
  };
};
