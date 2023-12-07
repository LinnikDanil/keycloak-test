import { FastifyRequest, FastifyReply } from 'fastify';
import { loginUser, refreshUserToken, logoutUser } from '../services/authService';

export const login = async (request: FastifyRequest, reply: FastifyReply) => {
    const { username, password } = request.body as any; // Предполагаем, что эти поля существуют
    return await loginUser(username, password, request, reply);
};

export const refresh = async (request: FastifyRequest, reply: FastifyReply) => {
    const currentSession = request.session.get('tokens');
    const refreshToken = currentSession?.refresh_token;
    return await refreshUserToken(refreshToken, request, reply);
};

export const logout = async (request: FastifyRequest, reply: FastifyReply) => {
    const currentSession = request.session.get('tokens');
    const refreshToken = currentSession?.refresh_token;
    return await logoutUser(refreshToken, request, reply);
};
