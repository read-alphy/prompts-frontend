export const API_HOST = process.env.REACT_APP_BACKEND_HOST || 'localhost:8000';
export const SSL = !API_HOST.startsWith('localhost');
export const WS_URL = `ws${SSL ? 's' : ''}://${API_HOST}/ws`;
export const API_BASE = `http${SSL ? 's' : ''}://${API_HOST}`;