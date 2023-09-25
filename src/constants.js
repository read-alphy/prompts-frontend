export const API_HOST = process.env.REACT_APP_BACKEND_HOST || 'localhost:8000';
export const SSL = !API_HOST.startsWith('localhost');
export const WS_URL_SUBMISSIONS = `ws${SSL ? 's' : ''}://${API_HOST}/submissions/ws`;
export const API_BASE = `http${SSL ? 's' : ''}://${API_HOST}`;

export const MODELS = {
    'gpt-3.5-turbo': 'GPT-3.5 Turbo',
    'gpt-3.5-turbo-instruct': 'GPT-3.5 Turbo Instruct',
    'gpt-4': 'GPT-4',
};
