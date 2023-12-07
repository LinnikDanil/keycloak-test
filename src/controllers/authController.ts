import { FastifyReply, FastifyRequest } from 'fastify';
import { loginUser, logoutUser, refreshUserToken } from '../services/authService';

// Обработчик запроса на вход в систему
export const login = async (request: FastifyRequest, reply: FastifyReply) => {
    const { username, password } = request.body as any; // Получение данных пользователя из тела запроса
    return await loginUser(username, password, request, reply);
};

// Обработчик запроса на обновление токена
export const refresh = async (request: FastifyRequest, reply: FastifyReply) => {
    const currentSession = request.session.get('tokens');
    const refreshToken = currentSession?.refresh_token;
    return await refreshUserToken(refreshToken, request, reply);
};

// Обработчик запроса на выход из системы
export const logout = async (request: FastifyRequest, reply: FastifyReply) => {
    const currentSession = request.session.get('tokens');
    const refreshToken = currentSession?.refresh_token;
    return await logoutUser(refreshToken, request, reply);
};
