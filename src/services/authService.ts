import { FastifyReply, FastifyRequest } from 'fastify';
import keycloakService from './keycloakService';
import jwt from 'jsonwebtoken';

/**
 * Функция для аутентификации пользователя через Keycloak.
 * @param username - Логин пользователя.
 * @param password - Пароль пользователя.
 * @param request - Объект запроса Fastify.
 * @param reply - Объект ответа Fastify.
 * @returns Ответ сервера с данными пользователя или сообщением об ошибке.
 */
export const loginUser = async (username: string, password: string, request: FastifyRequest, reply: FastifyReply) => {
    // Проверка корректности логина и пароля
    if (!validateCredentials(username, password)) {
        return reply.code(400).send({ error: 'Invalid username or password' });
    }

    // Проверка, не выполнен ли уже вход
    if (request.session.get('tokens')) {
        return reply.code(403).send({ message: 'Already logged in' });
    }

    try {
        // Получение токенов от Keycloak
        const tokenData = await keycloakService.getToken(username, password);
        request.session.set('tokens', tokenData);

        // Декодирование токена доступа для получения данных пользователя
        const decodedToken = jwt.decode(tokenData.access_token) as any;
        return reply.send({
            userId: decodedToken.sub,
            role: decodedToken.realm_access.roles[0],
            fullName: decodedToken.full_name,
            position: decodedToken.position,
            region: decodedToken.region
        });
    } catch (error) {
        return reply.code(401).send({ error: 'Login failed' });
    }
};

/**
 * Валидация логина и пароля.
 * @param username - Логин пользователя.
 * @param password - Пароль пользователя.
 * @returns {boolean} Результат проверки валидности данных.
 */
function validateCredentials(username: string, password: string): boolean {
    // Здесь можно добавить более сложную логику валидации
    return !!(username && password);
}

/**
 * Функция для обновления токенов пользователя.
 * @param refreshToken - Токен для обновления.
 * @param request - Объект запроса Fastify.
 * @param reply - Объект ответа Fastify.
 * @returns Ответ сервера с сообщением о результате операции.
 */
export const refreshUserToken = async (refreshToken: string, request: FastifyRequest, reply: FastifyReply) => {
    try {
        // Обновление токенов через Keycloak
        const newTokenData = await keycloakService.refreshAccessToken(refreshToken);
        request.session.set('tokens', newTokenData);
        return reply.send({ message: 'Token refreshed successfully' });
    } catch (error) {
        return reply.code(401).send({ error: 'Token refresh failed' });
    }
};

/**
 * Функция для выхода пользователя из системы.
 * @param refreshToken - Токен для обновления, используется для логаута в Keycloak.
 * @param request - Объект запроса Fastify.
 * @param reply - Объект ответа Fastify.
 * @returns Ответ сервера с сообщением о результате операции.
 */
export const logoutUser = async (refreshToken: string, request: FastifyRequest, reply: FastifyReply) => {
    try {
        // Запрос на выход пользователя в Keycloak
        await keycloakService.logout(refreshToken);
        // Удаление сессии пользователя на сервере
        request.session.delete();
        return reply.send({ message: 'Logged out successfully' });
    } catch (error) {
        return reply.code(401).send({ error: 'Logout failed' });
    }
};
