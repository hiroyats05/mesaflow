import Fastify from 'fastify';
import jwt from '@fastify/jwt';
import { prisma } from './prisma/client';
import { registerRoutes } from './routes';

const fastify = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
    transport:
      process.env.LOG_FILE
        ? {
            target: 'pino/file',
            options: {
              destination: process.env.LOG_FILE,
              mkdir: true,
            },
          }
        : process.env.NODE_ENV !== 'production'
        ? {
            target: 'pino-pretty',
            options: { colorize: true, singleLine: true },
          }
        : undefined,
    redact: ['req.headers.authorization'],
  },
  disableRequestLogging: true,
});

// JWT Plugin
fastify.register(jwt, {
  secret: process.env.JWT_SECRET,
});

// Decorator para autenticação
fastify.decorate('authenticate', async (request: any, reply: any) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.code(401).send({ error: 'Token inválido ou expirado' });
  }
});

// Log básico de request/response
fastify.addHook('onRequest', async (request) => {
  (request as any).startTime = process.hrtime.bigint();
  request.log.info(
    {
      method: request.method,
      url: request.url,
      ip: request.ip,
    },
    'request start'
  );
});

fastify.addHook('onResponse', async (request, reply) => {
  const start = (request as any).startTime as bigint | undefined;
  const durationMs = start ? Number(process.hrtime.bigint() - start) / 1_000_000 : undefined;

  request.log.info(
    {
      method: request.method,
      url: request.url,
      statusCode: reply.statusCode,
      durationMs,
      userId: (request as any).user?.id,
    },
    'request completed'
  );
});

// Decorator para Prisma
fastify.decorate('prisma', prisma);

fastify.register(registerRoutes);

fastify.addHook('onClose', async () => {
  await prisma.$disconnect();
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log('✅ Server running on http://0.0.0.0:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();