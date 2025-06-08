import axios, { AxiosRequestConfig } from 'axios';
import axiosRetry from 'axios-retry';

const BASE_API_URL = import.meta.env['VITE_API_HOST'];

axiosRetry(axios, { retries: 1 });

const axiosConfig: AxiosRequestConfig = {
  responseType: 'json',
  baseURL: `${BASE_API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
};

export const apiClient = axios.create(axiosConfig);
