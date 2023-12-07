export default {
    keycloak: {
        baseUrl: 'http://localhost:8080/realms/testERP/protocol/openid-connect',
        clientId: 'testerp-rest-api',
        clientSecret: 'jQaQuXd2BMubnGbQXlTgjupFdnC2UIuZ'
    },
    secureSessionConfig: {
        cookieName: 'my-session-cookie',
        key: Buffer.from('a'.repeat(32)), // Используйте безопасный ключ
        cookie: {
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'
        }
    }
};
