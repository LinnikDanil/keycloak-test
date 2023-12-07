import { FastifyInstance } from 'fastify';
import { clientAdminEndpoint, clientUserEndpoint, testEndpoint } from '../controllers/testController';
import { checkTokensAndRole } from "../utils/checkTokensAndRole";

// Регистрация тестовых маршрутов
export default async (server: FastifyInstance) => {
    server.get('/test', testEndpoint); // Тестовый маршрут доступен без аутентификации
    server.get('/test-user', { preHandler: checkTokensAndRole('user') }, clientUserEndpoint); // Тестовый маршрут для роли "user"
    server.get('/test-admin', { preHandler: checkTokensAndRole('admin') }, clientAdminEndpoint); // Тестовый маршрут для роли "admin"
};
