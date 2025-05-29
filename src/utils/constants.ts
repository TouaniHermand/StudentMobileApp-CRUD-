export const API_CONFIG = {
    BASE_URL: process.env.REACT_APP_API_URL || 'https://localhost:8443/api/v1',
    TIMEOUT: 30000,
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000,
  } as const;
  
  export const SECURITY_HEADERS = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
  } as const;
  
  export const ENDPOINTS = {
    STUDENTS: '/students',
    AUTH: '/auth',
    HEALTH: '/actuator/health',
  } as const;