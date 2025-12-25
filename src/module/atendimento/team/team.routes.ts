import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { TeamService } from './team.service';

const teamService = new TeamService();

export async function teamRoutes(fastify: FastifyInstance) {
    // CRUD 
    fastify.post(
        '/teams/createUser',
        { onRequest: [fastify.authenticate] },
        async (request: FastifyRequest, reply: FastifyReply) => {
            const body = request.body as {
                nome: string;
                login: string;
                password: string;
                empresa: number;
                funcao: 'caixa' | 'garcom' | 'entregador';
                status: 'ativo' | 'inativo';
            };

            try {
                const user = await teamService.create(body);
                return reply.code(201).send('Usuário criado com sucesso!');
            } catch (error: any) {
                if (error.code === 'P2002') {
                    return reply.code(400).send({ error: 'Usuário já existe' });
                }
            }
        }
    )

    fastify.put(
        '/teams/updateUser/:id',
        { onRequest: [fastify.authenticate] },
        async (request: FastifyRequest, reply: FastifyReply) => {
            const { id } = request.params as { id: string };
            const body = request.body as Partial<{
                nome: string;
                login: string;
                password: string;
                funcao: 'caixa' | 'garcom' | 'entregador';
                status: 'ativo' | 'inativo';
            }>;

            try {
                const result = await teamService.update(body, Number(id));
                if (result.count === 0) {
                    return reply.code(404).send({ error: 'Usuário não encontrado' });
                }
                return reply.code(200).send({ message: `Usuário id: ${id} atualizado com sucesso` });
            } catch (error) {
                return reply.code(500).send({ error: 'Erro ao atualizar usuário' });
            }
        }
    );

    fastify.delete(
        '/teams/deleteUser/:id',
        { onRequest: [fastify.authenticate] },
        async (request: FastifyRequest, reply: FastifyReply) => {
            const { id } = request.params as { id: string };

            try {
                const result = await teamService.delete(Number(id));
                if (result.count === 0) {
                    return reply.code(404).send({ error: 'Usuário não encontrado' });
                }
                return reply.code(200).send({ message: `Usuário id: ${id} deletado com sucesso` });
            } catch (error) {
                return reply.code(500).send({ error: 'Erro ao deletar usuário' });
            }
        }
    );

    // Listagens
    fastify.get(
        '/teams/empresa/:empresaId',
        { onRequest: [fastify.authenticate] },
        async (request: FastifyRequest, reply: FastifyReply) => {
            const { empresaId } = request.params as { empresaId: string };

            const users = await teamService.listByEmpresa(empresaId);
            return reply.code(200).send(users);
        }
    );

    fastify.get(
        '/teams/nome/:name/:empresaId',
        { onRequest: [fastify.authenticate] },
        async (request: FastifyRequest, reply: FastifyReply) => {
            const { name, empresaId } = request.params as { name: string; empresaId: string };
            
            const user = await teamService.getByName(name, Number(empresaId));
            if (!user) {
                return reply.code(404).send({ error: 'Usuário não encontrado' });
            }

            return reply.code(200).send(user);
        }
    );
}