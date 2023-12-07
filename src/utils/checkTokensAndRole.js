"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkTokensAndRole = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const keycloakService_1 = __importDefault(require("../services/keycloakService"));
// Middleware для проверки роли пользователя
const checkTokensAndRole = (requiredRole) => {
    return (request, reply, done) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const sessionData = request.session.get('tokens');
        const accessToken = sessionData === null || sessionData === void 0 ? void 0 : sessionData.access_token;
        const refreshToken = sessionData === null || sessionData === void 0 ? void 0 : sessionData.refresh_token;
        if (!accessToken) {
            reply.code(401).send({ error: 'Unauthorized: No access token' });
            return done(new Error('Unauthorized: No access token'));
        }
        if (!isAccessTokenValid(accessToken)) {
            // Access токен истек
            if (!refreshToken || !(yield refreshTokens(refreshToken, request))) {
                reply.code(401).send({ error: 'Token refresh failed' });
                return done(new Error('Token refresh failed'));
            }
        }
        if (!hasUserRole(((_a = request.session.get('tokens')) === null || _a === void 0 ? void 0 : _a.access_token) || '', requiredRole)) {
            reply.code(403).send({ error: 'Forbidden: Incorrect role' });
            return done(new Error('Forbidden: Incorrect role'));
        }
        done();
    });
};
exports.checkTokensAndRole = checkTokensAndRole;
const isAccessTokenValid = (token) => {
    const decodedToken = jsonwebtoken_1.default.decode(token);
    if (typeof decodedToken === 'string' || !decodedToken)
        return false;
    const currentTime = Math.floor(Date.now() / 1000);
    return currentTime < decodedToken.exp;
};
const refreshTokens = (refreshToken, request) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const refreshedTokens = yield keycloakService_1.default.refreshAccessToken(refreshToken);
        request.session.set('tokens', refreshedTokens);
        return true;
    }
    catch (error) {
        return false;
    }
});
const hasUserRole = (token, requiredRole) => {
    var _a;
    const decodedToken = jsonwebtoken_1.default.decode(token);
    const role = (_a = decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.realm_access) === null || _a === void 0 ? void 0 : _a.roles[0];
    return role === requiredRole;
};
