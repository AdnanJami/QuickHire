import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

// Jobs
export const getJobs = (params = {}) => api.get('/jobs', { params });
export const getJob = (id) => api.get(`/jobs/${id}`);
export const createJob = (data) => api.post('/jobs', data);
export const deleteJob = (id) => api.delete(`/jobs/${id}`);

// Applications
export const submitApplication = (data) => api.post('/applications', data);
export const getApplications = () => api.get('/applications');

export default api;
