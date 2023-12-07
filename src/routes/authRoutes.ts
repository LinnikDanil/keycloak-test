import { FastifyInstance } from 'fastify';
import { login, refresh, logout } from '../controllers/authController';
import {LoginBody} from "../utils/types/customTypes";

export default async function (fastify: FastifyInstance) {
    fastify.post<{ Body: LoginBody }>('/login', login);
    fastify.post('/refresh', refresh);
    fastify.post('/logout', logout);
}
