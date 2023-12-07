// Экспортируем конфигурационный объект
export default {
    // Настройки для Keycloak
    keycloak: {
        baseUrl: 'http://localhost:8080/realms/testERP/protocol/openid-connect', // Базовый URL Keycloak
        clientId: 'testerp-rest-api', // ID клиента в Keycloak
        clientSecret: 'jQaQuXd2BMubnGbQXlTgjupFdnC2UIuZ' // Секрет клиента в Keycloak
    },
    // Настройки для secureSession
    secureSessionConfig: {
        cookieName: 'my-session-cookie', // Имя куки для сессии
        key: Buffer.from('a'.repeat(32)), // Ключ шифрования для сессии
        cookie: {
            path: '/', // Путь для куки
            httpOnly: true, // Недоступность куки для JavaScript на клиенте
            secure: process.env.NODE_ENV === 'production' // Использование secure кук только в продакшене
        }
    }
};