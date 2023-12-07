import {FastifyInstance} from 'fastify';
import {clientAdminEndpoint, clientUserEndpoint, testEndpoint} from '../controllers/testController';
import {checkTokensAndRole} from "../utils/checkTokensAndRole";

export default async (server: FastifyInstance) => {
    server.get('/test', testEndpoint);
    server.get('/test-user', {preHandler: checkTokensAndRole('user')}, clientUserEndpoint);
    server.get('/test-admin', {preHandler: checkTokensAndRole('admin')}, clientAdminEndpoint);
};