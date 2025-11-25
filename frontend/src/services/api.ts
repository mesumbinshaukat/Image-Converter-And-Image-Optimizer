import axios from 'axios'

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

const api = axios.create({
    baseURL: `${BASE_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true,
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response?.data || error.message);
        if (error.response?.status === 401) {
            localStorage.removeItem('token')
            // Only redirect if not already on login page to avoid loops
            if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/admin-access')) {
                // window.location.href = '/login' // Optional: force redirect
            }
        }
        return Promise.reject(error)
    }
)

export default api
