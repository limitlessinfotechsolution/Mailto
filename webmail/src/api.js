import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // Vite proxy will handle this
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export const login = (email, password) => api.post('/auth/login', { email, password });
export const getProfile = () => api.get('/auth/me');

export const getFolders = () => api.get('/folders');
export const getMessages = (folderId, params = {}) => api.get(`/messages/${folderId}`, { params });
export const sendMessage = (data) => api.post('/messages/send', data);
export const snoozeMessage = (id, snoozeUntil) => api.post(`/messages/${id}/snooze`, { snoozeUntil });
export const undoEmail = (jobId) => api.post(`/messages/undo/${jobId}`);

// Calendar
export const getEvents = () => api.get('/calendar');
export const createEvent = (data) => api.post('/calendar', data);

// Contacts
export const getContacts = () => api.get('/contacts');
export const createContact = (data) => api.post('/contacts', data);

// Tasks
export const getTasks = () => api.get('/tasks');
export const createTask = (data) => api.post('/tasks', data);
export const updateTask = (id, data) => api.patch(`/tasks/${id}`, data);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);

// Notes
export const getNotes = () => api.get('/notes');
export const createNote = (data) => api.post('/notes', data);

// Campaigns
export const getCampaigns = () => api.get('/campaigns');
export const createCampaign = (data) => api.post('/campaigns', data);
export const sendCampaign = (id) => api.post(`/campaigns/${id}/send`);

// Admin
export const getAdminUsers = () => api.get('/admin/users');
export const createAdminUser = (data) => api.post('/admin/users', data);
export const getAdminDomains = () => api.get('/admin/domains');
export const createAdminDomain = (data) => api.post('/admin/domains', data);
export const getAdminStats = () => api.get('/stats');

export default api;
