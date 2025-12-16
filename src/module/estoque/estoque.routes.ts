import { FastifyInstance, FastifyRequest } from 'fastify';
import { EstoqueService } from './estoque.service';
import { PrismaEstoqueRepository } from './estoque.repository';

const repo = new PrismaEstoqueRepository();
const service = new EstoqueService(repo);

export async function estoqueRoutes(fastify: FastifyInstance) {
  // Listar itens de estoque do usuário
  fastify.get(
    '/estoques',
    { onRequest: [fastify.authenticate] },
    async (request: FastifyRequest, reply) => {
      const userId = (request.user as any).id;
      return service.list(userId);
    }
  );

  // Buscar item por ID
  fastify.get(
    '/estoques/:id',
    { onRequest: [fastify.authenticate] },
    async (request: FastifyRequest, reply) => {
      const { id } = request.params as { id: string };
      const userId = (request.user as any).id;

      const item = await service.getById(Number(id), userId);
      if (!item) return reply.code(404).send({ error: 'Item não encontrado' });
      return item;
    }
  );

  // Criar item de estoque
  fastify.post(
    '/estoques',
    { onRequest: [fastify.authenticate] },
    async (request: FastifyRequest, reply) => {
      const userId = (request.user as any).id;

      const body = request.body as {
        nome: string;
        quantidade?: number;
        categoria?: string | null;
        fornecedor?: string | null;
      };

      try {
        const item = await service.create({
          userId,
          ...body,
        });
        return reply.code(201).send(item);
      } catch (error: any) {
        if (error.code === 'P2002') {
          return reply.code(400).send({ error: 'Item já existe' });
        }
        return reply.code(500).send({ error: 'Erro ao criar item' });
      }
    }
  );

  // Atualizar item de estoque
  fastify.put(
    '/estoques/:id',
    { onRequest: [fastify.authenticate] },
    async (request: FastifyRequest, reply) => {
      const { id } = request.params as { id: string };
      const userId = (request.user as any).id;

      const body = request.body as Partial<{
        nome: string;
        quantidade: number;
        categoria: string | null;
        fornecedor: string | null;
      }>;

      try {
        const result = await service.update(Number(id), userId, body);
        if (result.count === 0) {
          return reply.code(404).send({ error: 'Item não encontrado' });
        }
        const item = await service.getById(Number(id), userId);
        return item;
      } catch (error) {
        return reply.code(404).send({ error: 'Item não encontrado' });
      }
    }
  );

  // Deletar item de estoque
  fastify.delete(
    '/estoques/:id',
    { onRequest: [fastify.authenticate] },
    async (request: FastifyRequest, reply) => {
      const { id } = request.params as { id: string };
      const userId = (request.user as any).id;

      try {
        const item = await service.getById(Number(id), userId);
        if (!item) return reply.code(404).send({ error: 'Item não encontrado' });

        await service.delete(Number(id), userId);
        return reply.code(200).send({ message: `Item ${item.nome} deletado com sucesso` });
      } catch (error) {
        return reply.code(404).send({ error: 'Item não encontrado' });
      }
    }
  );
}
