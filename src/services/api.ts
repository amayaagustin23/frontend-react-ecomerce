import axios from 'axios';

const baseURL = 'http://ec2-18-188-8-45.us-east-2.compute.amazonaws.com/api/v1';

export const api = axios.create({
  baseURL,
  withCredentials: true,
});

api.interceptors.response.use((response) => response);
