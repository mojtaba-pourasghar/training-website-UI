import axios from 'axios';
import { useRouter } from 'next/router';

const api = axios.create({
  baseURL: process.env.API_URL,
});

api.interceptors.response.use(
  response => response,
  error => {
    const status = error.response ? error.response.status : null;
    if (status === 401) {
      // Log user out and redirect to login page
      const router = useRouter();
      router.push('/auth/login');
    }
    return Promise.reject(error);
  }
);

export default api;