// Подключаем необходимые зависимости
import Fastify from 'fastify'; // Основной фреймворк Fastify для создания сервера
import secureSession from '@fastify/secure-session'; // Плагин для работы с безопасными сессиями
import authRoutes from './routes/authRoutes'; // Маршруты аутентификации
import testRoutes from './routes/testRoutes'; // Тестовые маршруты
import config from '../config/config'; // Конфигурация, включая настройки Keycloak и сессии

// Создаем экземпляр сервера Fastify с включенным логированием
const server = Fastify({ logger: true });

// Регистрируем плагин secureSession для управления сессиями через куки
server.register(secureSession, config.secureSessionConfig);

// Регистрируем маршруты для аутентификации и тестирования
server.register(authRoutes);
server.register(testRoutes);

// Функция для запуска сервера
const start = async () => {
    try {
        // Слушаем сервер на порту 3000
        await server.listen({ port: 3000 });
        console.log(`Server is running on http://localhost:3000`);
    } catch (err) {
        // В случае ошибки логируем и прерываем процесс
        server.log.error(err);
        process.exit(1);
    }
};

// Запускаем сервер
start();
