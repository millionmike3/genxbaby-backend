import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use((config) => {
  const orgId = typeof window !== 'undefined'
    ? localStorage.getItem('orgId')
    : null;

  if (orgId) {
    config.headers['x-org-id'] = orgId;
  }

  return config;
});
