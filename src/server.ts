import Fastify from 'fastify';
import secureSession from '@fastify/secure-session';
import authRoutes from './routes/authRoutes';
import testRoutes from './routes/testRoutes';
import config from '../config/config';

const server = Fastify({ logger: true });

server.register(secureSession, config.secureSessionConfig);

// Регистрация маршрутов
server.register(authRoutes);
server.register(testRoutes);

const start = async () => {
    try {
        await server.listen({ port: 3000 });
        console.log(`Server is running on http://localhost:3000`);
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

start();
