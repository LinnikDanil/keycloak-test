"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function (resolve) {
            resolve(value);
        });
    }

    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }

        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }

        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }

        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : {"default": mod};
};
Object.defineProperty(exports, "__esModule", {value: true});
const fastify_1 = __importDefault(require("fastify"));
const secure_session_1 = __importDefault(require("@fastify/secure-session"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const testRoutes_1 = __importDefault(require("./routes/testRoutes"));
const config_1 = __importDefault(require("../config/config"));
const server = (0, fastify_1.default)({logger: true});
server.register(secure_session_1.default, config_1.default.secureSessionConfig);
// Регистрация маршрутов
server.register(authRoutes_1.default);
server.register(testRoutes_1.default);
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield server.listen({port: 3000});
        console.log(`Server is running on http://localhost:3000`);
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
});
start();
