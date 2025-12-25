import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { TeamService } from '../atendimento/team/team.service';
import { CardapioService } from '../atendimento/cardapio/cardapio.service';
import { EstoqueService } from '../estoque/estoque.service';
import { UserService } from '../user/user.service';

const teamService = new TeamService();
const cardapioService = new CardapioService();
const estoqueService = new EstoqueService();
const userService = new UserService();

export async function adminRoutes(fastify: FastifyInstance) {
    // Painel administrativo - listar tudo sem filtros
    // Apenas usuários autenticados podem acessar
    
    // Listar todos os times
    fastify.get(
        '/admin/teams',
        { onRequest: [fastify.authenticate] },
        async (request: FastifyRequest, reply: FastifyReply) => {
            try {
                const teams = await teamService.listAll();
                return reply.send(teams);
            } catch (error) {
                return reply.code(500).send({ error: 'Erro ao listar times' });
            }
        }
    );

    // Listar todos os itens do cardápio
    fastify.get(
        '/admin/cardapios',
        { onRequest: [fastify.authenticate] },
        async (request: FastifyRequest, reply: FastifyReply) => {
            try {
                const items = await cardapioService.listAll();
                return reply.send(items);
            } catch (error) {
                return reply.code(500).send({ error: 'Erro ao listar cardápio' });
            }
        }
    );

    // Listar todos os itens do estoque
    fastify.get(
        '/admin/estoque',
        { onRequest: [fastify.authenticate] },
        async (request: FastifyRequest, reply: FastifyReply) => {
            try {
                const items = await estoqueService.listAll();
                return reply.send(items);
            } catch (error) {
                return reply.code(500).send({ error: 'Erro ao listar estoque' });
            }
        }
    );

    // Listar todos os usuários
    fastify.get(
        '/admin/usuarios',
        { onRequest: [fastify.authenticate] },
        async (request: FastifyRequest, reply: FastifyReply) => {
            try {
                const users = await userService.listAll();
                return reply.send(users);
            } catch (error) {
                return reply.code(500).send({ error: 'Erro ao listar usuários' });
            }
        }
    );
}
