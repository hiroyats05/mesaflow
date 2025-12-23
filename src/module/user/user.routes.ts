import { FastifyInstance, FastifyRequest } from 'fastify';
import { UserService } from './user.service';
import { PrismaUserRepository } from './user.repository';

const repo = new PrismaUserRepository();
const service = new UserService(repo);

export async function userRoutes(fastify: FastifyInstance) {
// Listar usuários (somente admin)
  fastify.get(
    '/users',
    { onRequest: [fastify.authenticate] },
    async (request: FastifyRequest, reply) => {
      const userRole = (request.user as any).role;
      
      if (userRole !== 'admin') {
        return reply.code(403).send({ error: 'Acesso negado. Apenas administradores podem listar usuários' });
      }
      
      return service.list();
    }
  );
// Listar usuários pelo Id (próprio usuário ou admin)
  fastify.get(
    '/users/:id',
    { onRequest: [fastify.authenticate] },
    async (request: FastifyRequest, reply) => {
      const { id } = request.params as { id: string };
      const userId = (request.user as any).id;
      const userRole = (request.user as any).role;

      // Só pode ver próprio perfil ou admin pode ver qualquer um
      if (Number(id) !== userId && userRole !== 'admin') {
        return reply.code(403).send({ error: 'Acesso negado. Você só pode ver seu próprio perfil' });
      }
      
      const user = await service.getById(Number(id));
      if (!user) return reply.code(404).send({ error: 'User not found' });
      return repo.DTOresponseUser(user);
    }
  );
// Criar usuário
  fastify.post('/users', async (request, reply) => {
    const body = request.body as {
      email: string;
      name: string;
      password: string;
      phone?: string | null;
      status?: string;
    };

    const existingEmail = body.email ? await service.findByEmail(body.email) : null;
    const existingPhone = body.phone ? await service.findByPhone(body.phone) : null;

    if (existingPhone && existingEmail) {
      return reply.code(400).send({ error: 'Email e Telefone já estão em uso' });
    }
    else if (existingEmail) {
      return reply.code(400).send({ error: 'Email já está em uso' });
    }
    else if (existingPhone) {
      return reply.code(400).send({ error: 'Telefone já está em uso' });
    }

    const user = await service.create(body);
    return reply.code(201).send(await repo.DTOresponseUser(user));
  });
// Atualizar usuário 
  fastify.put(
    '/users/:id',
    { onRequest: [fastify.authenticate] },
    async (request: FastifyRequest, reply) => {
      const { id } = request.params as { id: string };
      const userId = (request.user as any).id;
      const userRole = (request.user as any).role;

      if (Number(id) !== userId && userRole !== 'admin') {
        return reply.code(403).send({ error: 'Acesso negado. Você só pode atualizar seu próprio perfil' });
      }
      
      const body = request.body as Partial<{
        email: string;
        name: string;
        password: string;
        phone?: string | null;
        status?: string;
      }>;

      try {
        const user = await service.update(Number(id), body);
        return reply.code(200).send({ message: `Usuário ${user.name} id: ${id} atualizado com sucesso` });
      } catch (error) {
        return reply.code(404).send({ error: 'User not found' });
      }
    }
  );
// Deletar usuário
  fastify.delete(
    '/users/:id',
    { onRequest: [fastify.authenticate] },
    async (request: FastifyRequest, reply) => {
      const { id } = request.params as { id: string };
      const userId = (request.user as any).id;
      const userRole = (request.user as any).role;
      
      if (Number(id) !== userId && userRole !== 'admin') {
        return reply.code(403).send({ error: 'Acesso negado. Você só pode deletar sua própria conta' });
      }
      
      try {
        const user = await service.getById(Number(id));
        if (!user) return reply.code(404).send({ error: 'User not found' });
        
        await service.delete(Number(id));
        return reply.code(200).send({ message: `Usuário ${user.name} de id: ${id}, email: ${user.email} deletado com sucesso` });
      } catch (error) {
        return reply.code(404).send({ error: 'User not found' });
      }
    }
  );
}
