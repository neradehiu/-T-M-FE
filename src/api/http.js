import axios from 'axios';

const http = axios.create({
  baseURL: 'https://t-m-dw2u.onrender.com/api',
});
http.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default http;
