import axios from 'axios';
import config from '../../config/config';

/**
 * Сервис для работы с Keycloak API.
 */
export default {
    /**
     * Получить токены для пользователя.
     * @param username - Логин пользователя.
     * @param password - Пароль пользователя.
     * @returns Объект с токенами.
     */
    async getToken(username: string, password: string) {
        const response = await axios.post(`${config.keycloak.baseUrl}/token`, new URLSearchParams({
            client_id: config.keycloak.clientId,
            client_secret: config.keycloak.clientSecret,
            username,
            password,
            grant_type: 'password'
        }), {
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });

        return response.data;
    },

    /**
     * Обновить access токен с использованием refresh токена.
     * @param refreshToken - Токен обновления.
     * @returns Объект с обновленными токенами.
     */
    async refreshAccessToken(refreshToken: string) {
        const response = await axios.post(`${config.keycloak.baseUrl}/token`, new URLSearchParams({
            client_id: config.keycloak.clientId,
            client_secret: config.keycloak.clientSecret,
            refresh_token: refreshToken,
            grant_type: 'refresh_token'
        }), {
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });

        return response.data;
    },

    /**
     * Выполнить выход пользователя, отзывая его refresh токен.
     * @param refreshToken - Токен обновления для отзыва.
     */
    async logout(refreshToken: string) {
        await axios.post(`${config.keycloak.baseUrl}/logout`, new URLSearchParams({
            client_id: config.keycloak.clientId,
            client_secret: config.keycloak.clientSecret,
            refresh_token: refreshToken
        }), {
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    }
};
