import { EstoqueItem } from '@prisma/client';
import { prisma } from '../../prisma/client';

export type CreateEstoqueData = {
  userId: number;
  nome: string;
  quantidade?: number;
  categoria?: string | null;
  fornecedor?: string | null;
};

export type UpdateEstoqueData = Partial<{
  nome: string;
  quantidade: number;
  categoria: string | null;
  fornecedor: string | null;
}>;

export interface EstoqueRepository {
  create(data: CreateEstoqueData): Promise<EstoqueItem>;
  list(userId: number): Promise<EstoqueItem[]>;
  listAll(): Promise<EstoqueItem[]>;
  findById(id: number, userId: number): Promise<EstoqueItem | null>;
  update(id: number, userId: number, data: UpdateEstoqueData): Promise<{ count: number }>;
  delete(id: number, userId: number): Promise<{ count: number }>;
}

export class PrismaEstoqueRepository implements EstoqueRepository {
  async create(data: CreateEstoqueData) {
    return prisma.estoqueItem.create({ data });
  }

  async list(userId: number) {
    return prisma.estoqueItem.findMany({ where: { userId } });
  }

  async listAll() {
    return prisma.estoqueItem.findMany();
  }

  async findById(id: number, userId: number) {
    return prisma.estoqueItem.findFirst({ where: { id, userId } });
  }

  async update(id: number, userId: number, data: UpdateEstoqueData) {
    return prisma.estoqueItem.updateMany({ where: { id, userId }, data });
  }

  async delete(id: number, userId: number) {
    return prisma.estoqueItem.deleteMany({ where: { id, userId } });
  }
}
