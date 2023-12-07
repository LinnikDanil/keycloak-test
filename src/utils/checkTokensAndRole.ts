import {FastifyReply, FastifyRequest, HookHandlerDoneFunction} from 'fastify';
import jwt from 'jsonwebtoken';
import keycloakService from "../services/keycloakService";

// Middleware для проверки роли пользователя
export const checkTokensAndRole = (requiredRole: string) => {
    return async (request: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction) => {
        const sessionData = request.session.get('tokens');
        const accessToken = sessionData?.access_token;
        const refreshToken = sessionData?.refresh_token;

        if (!accessToken) {
            reply.code(401).send({error: 'Unauthorized: No access token'});
            return done(new Error('Unauthorized: No access token'));
        }

        if (!isAccessTokenValid(accessToken)) {
            // Access токен истек
            if (!refreshToken || !await refreshTokens(refreshToken, request)) {
                reply.code(401).send({error: 'Token refresh failed'});
                return done(new Error('Token refresh failed'));
            }
        }

        if (!hasUserRole(request.session.get('tokens')?.access_token || '', requiredRole)) {
            reply.code(403).send({error: 'Forbidden: Incorrect role'});
            return done(new Error('Forbidden: Incorrect role'));
        }

        done();
    };
};

const isAccessTokenValid = (token: string): boolean => {
    const decodedToken = jwt.decode(token) as any;
    if (typeof decodedToken === 'string' || !decodedToken) return false;

    const currentTime = Math.floor(Date.now() / 1000);
    return currentTime < decodedToken.exp;
};

const refreshTokens = async (refreshToken: string, request: FastifyRequest): Promise<boolean> => {
    try {
        const refreshedTokens = await keycloakService.refreshAccessToken(refreshToken);
        request.session.set('tokens', refreshedTokens);
        return true;
    } catch (error) {
        return false;
    }
};

const hasUserRole = (token: string, requiredRole: string): boolean => {
    const decodedToken = jwt.decode(token) as any;
    const role = decodedToken?.realm_access?.roles[0];
    return role === requiredRole;
};