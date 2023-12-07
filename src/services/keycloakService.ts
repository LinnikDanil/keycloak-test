import axios from 'axios';
import config from '../../config/config';

export default {
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
