import { FastifyRequest, FastifyReply } from 'fastify';
import keycloakService from './keycloakService';
import jwt from 'jsonwebtoken';

export const loginUser = async (username: string, password: string, request: FastifyRequest, reply: FastifyReply) => {
    // Валидация логина и пароля
    if (!validateCredentials(username, password)) {
        return reply.code(400).send({ error: 'Invalid username or password' });
    }

    // Проверка на существующую сессию
    if (request.session.get('tokens')) {
        return reply.code(403).send({ message: 'Already logged in' });
    }

    try {
        const tokenData = await keycloakService.getToken(username, password);
        request.session.set('tokens', tokenData);

        const decodedToken = jwt.decode(tokenData.access_token) as any; // Приведение типа к любому
        return reply.send({
            userId: decodedToken.sub,
            role: decodedToken.realm_access.roles[0], // Первая роль пользователя
            fullName: decodedToken.full_name,
            position: decodedToken.position,
            region: decodedToken.region
        });
    } catch (error) {
        return reply.code(401).send({ error: 'Login failed' });
    }
};

function validateCredentials(username: string, password: string): boolean {
    // Пример валидации (можно улучшить/изменить в соответствии с вашими требованиями)
    // const validUsername = /^[a-zA-Z0-9_.-]+$/.test(username); // Только буквы, цифры и некоторые символы
    // const validPassword = password.length >= 8; // Минимальная длина пароля 8 символов

    // return validUsername && validPassword;

    return !!(username && password);
}


export const refreshUserToken = async (refreshToken: string, request: FastifyRequest, reply: FastifyReply) => {
    try {
        const newTokenData = await keycloakService.refreshAccessToken(refreshToken);
        request.session.set('tokens', newTokenData);
        return reply.send({ message: 'Token refreshed successfully' });
    } catch (error) {
        return reply.code(401).send({ error: 'Token refresh failed' });
    }
};

export const logoutUser = async (refreshToken: string, request: FastifyRequest, reply: FastifyReply) => {
    try {
        await keycloakService.logout(refreshToken);
        request.session.delete();
        return reply.send({ message: 'Logged out successfully' });
    } catch (error) {
        return reply.code(401).send({ error: 'Logout failed' });
    }
};
