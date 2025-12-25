import { FastifyInstance } from 'fastify';
import { authRoutes } from './auth/auth.routes';
import { userRoutes } from './module/user/user.routes';
import { estoqueRoutes } from './module/estoque/estoque.routes';
import { cardapioRoutes } from './module/atendimento/cardapio/cardapio.routes';
import { empresaRoutes } from './module/empresa/empresa.routes';
import { adminRoutes } from './module/admin/admin.routes';

export async function registerRoutes(app: FastifyInstance) {
  await app.register(authRoutes);
  await app.register(userRoutes);
  await app.register(estoqueRoutes);
  await app.register(cardapioRoutes);
  await app.register(empresaRoutes);
  await app.register(adminRoutes);
  // TODO: registrar outros módulos
  // await app.register(atendimentoRoutes);
  // await app.register(financeiroRoutes);
}
