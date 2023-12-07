import { FastifyInstance } from 'fastify';
import { login, refresh, logout } from '../controllers/authController';
import { LoginBody } from "../utils/types/customTypes";

// Регистрация маршрутов аутентификации
export default async function (fastify: FastifyInstance) {
    fastify.post<{ Body: LoginBody }>('/login', login); // Маршрут для входа в систему
    fastify.post('/refresh', refresh); // Маршрут для обновления токена
    fastify.post('/logout', logout); // Маршрут для выхода из системы
}
