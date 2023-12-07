import { FastifyReply, FastifyRequest } from 'fastify';

// Обработчик для тестового эндпоинта
export const testEndpoint = async (request: FastifyRequest, reply: FastifyReply) => {
    return { message: 'Это тестовый эндпоинт' };
};

// Эндпоинт для пользователей с ролью "user"
export const clientUserEndpoint = async (request: FastifyRequest, reply: FastifyReply) => {
    return { message: 'Доступ для роли USER' };
};

// Эндпоинт для пользователей с ролью "admin"
export const clientAdminEndpoint = async (request: FastifyRequest, reply: FastifyReply) => {
    return { message: 'Доступ для роли ADMIN' };
};
