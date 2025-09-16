// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://localhost:7101';

export const config = {
  apiUrl: API_BASE_URL,
  endpoints: {
    // Authentication
    login: '/api/auth',
    register: '/api/users',
    
    // Users
    userMe: '/api/users/me',
    updateUser: '/api/users',
    
    // Topics and test content
    topics: '/api/topics',
    bilets: '/api/bilets?pageSize=2000',
    questions: '/api/questions',
    testResults: '/api/test-results',
    userStats: '/api/users/stats'
  }
} as const;

export default config;