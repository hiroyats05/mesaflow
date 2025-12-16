import { FastifyInstance } from 'fastify';
import { EstoqueService } from './estoque.service';

const service = new EstoqueService();

export async function estoqueRoutes(fastify: FastifyInstance) {
  // Listar itens de estoque do usuário
  fastify.get('/estoque', async (request, reply) => {
    const userId = (request as any).userId;
    if (!userId) return reply.code(401).send({ error: 'Unauthorized' });
    return service.list(userId);
  });

  // Buscar item por ID
  fastify.get('/estoque/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const userId = (request as any).userId;
    if (!userId) return reply.code(401).send({ error: 'Unauthorized' });

    const item = await service.getById(Number(id), userId);
    if (!item) return reply.code(404).send({ error: 'Item não encontrado' });
    return item;
  });

  // Criar item de estoque
  fastify.post('/estoque', async (request, reply) => {
    const userId = (request as any).userId;
    if (!userId) return reply.code(401).send({ error: 'Unauthorized' });

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
  });

  // Atualizar item de estoque
  fastify.put('/estoque/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const userId = (request as any).userId;
    if (!userId) return reply.code(401).send({ error: 'Unauthorized' });

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
  });

  // Deletar item de estoque
  fastify.delete('/estoque/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const userId = (request as any).userId;
    if (!userId) return reply.code(401).send({ error: 'Unauthorized' });

    try {
      const item = await service.getById(Number(id), userId);
      if (!item) return reply.code(404).send({ error: 'Item não encontrado' });

      await service.delete(Number(id), userId);
      return reply.code(200).send({ message: `Item ${item.nome} deletado com sucesso` });
    } catch (error) {
      return reply.code(404).send({ error: 'Item não encontrado' });
    }
  });
}
