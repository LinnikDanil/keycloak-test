import { FastifyRequest, FastifyReply } from 'fastify';

export const testEndpoint = async (request: FastifyRequest, reply: FastifyReply) => {
    return { message: 'Это тестовый эндпоинт' };
};

// Эндпоинт для роли user
export const clientUserEndpoint = async (request: FastifyRequest, reply: FastifyReply) => {
    return { message: 'Доступ для роли USER' };
};

// Эндпоинт для роли admin
export const clientAdminEndpoint = async (request: FastifyRequest, reply: FastifyReply) => {
    return { message: 'Доступ для роли ADMIN' };
};

