import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import autoload from '@fastify/autoload';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const fastify = Fastify({
  logger: {
    level: process.env.LOG_LEVEL ?? 'warn',
  }
});

await fastify.register(cors, {
  methods: ["POST"],
  credentials: true,
  origin: [process.env.API_CORS_ORIGIN ?? "*"],
});

await fastify.register(autoload, {
  dir: join(__dirname, 'routes'),
});

await fastify.register(rateLimit, {
  global: true,
  max: 100,
  timeWindow: "1 minute",
  allowList: ["127.0.0.1"],
});

fastify.addHook("preHandler", (request, reply, done) => {
  if (!request?.headers?.apikey || request.headers.apikey !== process.env.API_KEY) {
    return reply.code(401).send(new Error("Invalid Api Key"));
  }
  done();
});

const start = async () => {
  try {
    const port = parseInt(process.env.PORT ?? '3000');
    await fastify.listen({ port, host: '0.0.0.0' });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
