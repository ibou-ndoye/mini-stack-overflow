import axios from 'axios';

const api = axios.create({
    // On utilise soit l'URL publique du backend (VITE_API_URL), soit le proxy relatif /api/
    baseURL: import.meta.env.VITE_API_URL || '/api/',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Intercepteur de requête pour ajouter le token JWT
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Intercepteur de réponse pour la gestion du rafraîchissement du token
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refresh_token');

            if (refreshToken) {
                try {
                    // On utilise la baseURL configurée ou l'URL complète via import.meta.env
                    const refreshUrl = import.meta.env.VITE_API_URL
                        ? `${import.meta.env.VITE_API_URL}token/refresh/`
                        : '/api/token/refresh/';

                    const response = await axios.post(refreshUrl, {
                        refresh: refreshToken,
                    });
                    localStorage.setItem('access_token', response.data.access);
                    api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;