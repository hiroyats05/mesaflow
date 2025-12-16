import Fastify from 'fastify';
import { prisma } from './prisma/client';
import { registerRoutes } from './routes';

const fastify = Fastify({ logger: true });

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