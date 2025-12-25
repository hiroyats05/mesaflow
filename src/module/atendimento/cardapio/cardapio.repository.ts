import { prisma } from '../../../prisma/client';

export type CreateCardapioData = {
    id: number,
    nome: string,
    empresa: number,
    valor: number,
    descricao?: string | null,
    disponivel: boolean
}

export type UpdateCardapioData = Partial<{
    nome: string,
    valor: number,
    descricao: string | null,
    disponivel: boolean
}>;

export type DTOresponseCardapio = {
    nome: string,
    valor: number,
    descricao?: string | null,
    disponivel: boolean
}

export interface CardapioRepository {
    create(data: Omit<CreateCardapioData, 'id'>): Promise<CreateCardapioData>;
    listByEmpresa(empresa: number): Promise<CreateCardapioData[]>;
    listAll(): Promise<CreateCardapioData[]>;
    findById(id: number): Promise<CreateCardapioData | null>;
    findByName(nome: string, empresa: number): Promise<CreateCardapioData | null>;
    update(id: number, data: UpdateCardapioData): Promise<{ count: number }>;
    delete(id: number): Promise<{ count: number }>;
}

export class PrismaCardapioRepository implements CardapioRepository {
    // CRUD
    async create(data: CreateCardapioData) {
        return prisma.cardapio.create({ data });
    }

    async update(id: number, data: UpdateCardapioData) {
        return prisma.cardapio.updateMany({ where: { id }, data });
    }

    async delete(id: number) {
        return prisma.cardapio.deleteMany({ where: { id } });
    }

    // listagem
    async listByEmpresa(empresa: number) {
        return prisma.cardapio.findMany({ where: { empresa } });
    }

    async listAll() {
        return prisma.cardapio.findMany();
    }

    async findById(id: number) {
        return prisma.cardapio.findUnique({ where: { id } });
    }

    async findByName(nome: string, empresa: number) {
        return prisma.cardapio.findFirst({ where: { nome, empresa } });
    }
}