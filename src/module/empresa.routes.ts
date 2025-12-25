import { EmpresaService } from "./empresa.service";
import { PrismaEmpresaRepository } from "./empresa.repository";
import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

const repo = new PrismaEmpresaRepository();
const service = new EmpresaService();

export async function empresaRoutes(fastify: FastifyInstance) {
    // Listar todas as empresas
    fastify.get('/empresas', async (request: FastifyRequest, reply: FastifyReply) => {
        const empresas = await service.list();
        return reply.send(empresas);
    });

    // Buscar empresa por ID
    fastify.get('/empresas/:id', async (request: FastifyRequest, reply: FastifyReply) => {
        const { id } = request.params as { id: string };
        const empresa = await service.getById(Number(id));
        
        if (!empresa) {
            return reply.code(404).send({ error: 'Empresa não encontrada' });
        }
        return reply.send(empresa);
    });

    // Criar empresa
    fastify.post('/empresas', { onRequest: [fastify.authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
        const userId = (request.user as any).id;
        const body = request.body as { nome: string };

        try {
            const empresa = await service.create({ userId, nome: body.nome });
            return reply.code(201).send(empresa);
        } catch (error: any) {
            return reply.code(500).send({ error: 'Erro ao criar empresa' });
        }
    });

    // Atualizar empresa
    fastify.put('/empresas/:id', { onRequest: [fastify.authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
        const { id } = request.params as { id: string };
        const body = request.body as { nome?: string };

        try {
            const result = await service.update(Number(id), body);
            if (result.count === 0) {
                return reply.code(404).send({ error: 'Empresa não encontrada' });
            }
            const empresa = await service.getById(Number(id));
            return reply.send(empresa);
        } catch (error) {
            return reply.code(500).send({ error: 'Erro ao atualizar empresa' });
        }
    });

    // Deletar empresa
    fastify.delete('/empresas/:id', { onRequest: [fastify.authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
        const { id } = request.params as { id: string };

        try {
            const result = await service.delete(Number(id));
            if (result.count === 0) {
                return reply.code(404).send({ error: 'Empresa não encontrada' });
            }
            return reply.code(204).send();
        } catch (error) {
            return reply.code(500).send({ error: 'Erro ao deletar empresa' });
        }
    });
}