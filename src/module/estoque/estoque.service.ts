import { prisma } from '../../prisma/client';

type CreateEstoqueItemInput = {
  userId: number;
  nome: string;
  quantidade?: number;
  categoria?: string | null;
  fornecedor?: string | null;
};

type UpdateEstoqueItemInput = Partial<{
  nome: string;
  quantidade: number;
  categoria: string | null;
  fornecedor: string | null;
}>;

export class EstoqueService {
  async create(data: CreateEstoqueItemInput) {
    return prisma.estoqueItem.create({ data });
  }

  async list(userId: number) {
    return prisma.estoqueItem.findMany({ where: { userId } });
  }

  async getById(id: number, userId: number) {
    return prisma.estoqueItem.findFirst({
      where: { id, userId },
    });
  }

  async update(id: number, userId: number, data: UpdateEstoqueItemInput) {
    return prisma.estoqueItem.updateMany({
      where: { id, userId },
      data,
    });
  }

  async delete(id: number, userId: number) {
    return prisma.estoqueItem.deleteMany({
      where: { id, userId },
    });
  }
}
