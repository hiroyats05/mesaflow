import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { PrismaCardapioRepository } from './cardapio.repository';
import { CardapioService } from './cardapio.service';

const repo = new PrismaCardapioRepository();
const service = new CardapioService(repo);

export async function cardapioRoutes(fastify: FastifyInstance) {
    // Criar item de cardápio
    fastify.post(
        '/cardapios',
        { onRequest: [fastify.authenticate] },
        async (request: FastifyRequest, reply: FastifyReply) => {
            const body = request.body as {
                nome: string;
                valor: number;
                descricao?: string | null;
                disponivel?: boolean;
            };

            try {
                const item = await service.create({
                    ...body,
                    disponivel: body.disponivel ?? true
                });
                return reply.code(201).send(item);
            } catch (error: any) {
                if (error.code === 'P2002') {
                    return reply.code(400).send({ error: 'Item já existe no cardápio' });
                }
                return reply.code(500).send({ error: 'Erro ao criar item' });
            }
        }
    );


    // Buscar item por ID
    fastify.get(
        '/cardapios/:id',
        async (request: FastifyRequest, reply: FastifyReply) => {
            const { id } = request.params as { id: string };
            
            const item = await service.getById(Number(id));
            if (!item) {
                return reply.code(404).send({ error: 'Item não encontrado' });
            }
            return reply.send(item);
        }
    );

    // Atualizar item
    fastify.put(
        '/cardapios/:id',
        { onRequest: [fastify.authenticate] },
        async (request: FastifyRequest, reply: FastifyReply) => {
            const { id } = request.params as { id: string };
            const body = request.body as {
                nome?: string;
                valor?: number;
                descricao?: string | null;
                disponivel?: boolean;
            };

            try {
                const result = await service.update(Number(id), body);
                if (result.count === 0) {
                    return reply.code(404).send({ error: 'Item não encontrado' });
                }
                
                const item = await service.getById(Number(id));
                return reply.send(item);
            } catch (error) {
                return reply.code(500).send({ error: 'Erro ao atualizar item' });
            }
        }
    );

    // Deletar item
    fastify.delete(
        '/cardapios/:id',
        { onRequest: [fastify.authenticate] },
        async (request: FastifyRequest, reply: FastifyReply) => {
            const { id } = request.params as { id: string };

            try {
                const result = await service.delete(Number(id));
                if (result.count === 0) {
                    return reply.code(404).send({ error: 'Item não encontrado' });
                }
                return reply.code(204).send();
            } catch (error) {
                return reply.code(500).send({ error: 'Erro ao deletar item' });
            }
        }
    );

    // Buscar item por nome
    fastify.get(
        '/cardapios/nome/:nome/:empresaId',
        { onRequest: [fastify.authenticate] },
        async (request: FastifyRequest, reply: FastifyReply) => {
            const { nome, empresaId } = request.params as { nome: string; empresaId: string };
            
            const item = await service.getByName(nome, Number(empresaId));
            if (!item) {
                return reply.code(404).send({ error: 'Item não encontrado' });
            }
            return reply.send(item);
        }
    );

    // Listar itens por empresa
    fastify.get(
        '/cardapios/empresa/:empresaId',
        { onRequest: [fastify.authenticate] },
        async (request: FastifyRequest, reply: FastifyReply) => {
            const { empresaId } = request.params as { empresaId: string };
            
            const items = await service.listByEmpresa(Number(empresaId));
            return reply.send(items);
        }
    );
}
