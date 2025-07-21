// src/api/axiosInstance.js (or .ts)

import axios from 'axios';
import { toast } from 'sonner';

// Create an instance of axios
const axiosInstance = axios.create({
    baseURL: 'https://ims-clxd.onrender.com/api', // Your base API URL
});

// Add a response interceptor
axiosInstance.interceptors.response.use(
    // Any status code that lie within the range of 2xx cause this function to trigger
    (response) => response,
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    (error) => {
        let friendlyMessage = 'An unexpected error occurred. Please try again later.';

        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            const status = error.response.status;
            if (status >= 500) {
                // Server-side errors (500, 502, 503, 504)
                friendlyMessage = 'Our server is currently experiencing issues. We are working on it and will be back online shortly.';
            } else if (status === 401 || status === 403) {
                // Authentication/Authorization errors
                friendlyMessage = 'Authentication failed. Please log in again.';
                // Optionally, you can redirect to login page here
                // window.location.href = '/signin';
            } else if (status === 404) {
                friendlyMessage = 'The requested resource was not found.';
            }
        } else if (error.request) {
            // The request was made but no response was received
            // This usually means the server is down or there's a network issue
            friendlyMessage = 'Cannot connect to the server. Please check your network connection or try again later.';
        }

        // Display the friendly message to the user
        toast.error('Something went wrong!', {
            description: friendlyMessage,
        });

        // It's important to reject the promise so the calling .catch() block can also handle it if needed
        return Promise.reject(error);
    }
);

// Add a request interceptor to automatically add the auth token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


export default axiosInstance;