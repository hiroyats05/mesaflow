import { FastifyInstance } from 'fastify';
import { UserService } from './user.service';
import { prisma } from '../../prisma/client';

const service = new UserService();

export async function userRoutes(fastify: FastifyInstance) {
// Listar usuários
  fastify.get('/users', async () => {
    return service.list();
  });
// Listar usuários pelo Id
  fastify.get('/users/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const user = await service.getById(Number(id));
    if (!user) return reply.code(404).send({ error: 'User not found' });
    return user;
  });
// Criar usuário
  fastify.post('/users', async (request, reply) => {
    const body = request.body as {
      email: string;
      name: string;
      password: string;
      phone?: string | null;
      status?: string;
    };

    const existingEmail = body.email ? await prisma.user.findUnique({ where: { email: body.email }}): null;
    const existingPhone = body.phone ? await prisma.user.findUnique({ where: { phone: body.phone }}) : null;

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
    return reply.code(201).send(user);
  });
// Atualizar usuário
  fastify.put('/users/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
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
  });
// Deletar usuário
  fastify.delete('/users/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    try {
      const user = await service.getById(Number(id));
      if (!user) return reply.code(404).send({ error: 'User not found' });
      
      await service.delete(Number(id));
      return reply.code(200).send({ message: `Usuário ${user.name} de id: ${id}, email: ${user.email} deletado com sucesso` });
    } catch (error) {
      return reply.code(404).send({ error: 'User not found' });
    }
  });
}
