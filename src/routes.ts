import { FastifyInstance } from 'fastify';
import { userRoutes } from './module/user/user.routes';
import { estoqueRoutes } from './module/estoque/estoque.routes';

export async function registerRoutes(app: FastifyInstance) {
  await app.register(userRoutes);
  await app.register(estoqueRoutes);
  // TODO: registrar outros módulos
  // await app.register(atendimentoRoutes);
  // await app.register(financeiroRoutes);
}
