import { CreateEstoqueData, EstoqueRepository, PrismaEstoqueRepository, UpdateEstoqueData } from './estoque.repository';

export class EstoqueService {
  constructor(private readonly repo: EstoqueRepository = new PrismaEstoqueRepository()) {}

  async create(data: CreateEstoqueData) {
    return this.repo.create(data);
  }

  async list(userId: number) {
    return this.repo.list(userId);
  }

  async getById(id: number, userId: number) {
    return this.repo.findById(id, userId);
  }

  async update(id: number, userId: number, data: UpdateEstoqueData) {
    return this.repo.update(id, userId, data);
  }

  async delete(id: number, userId: number) {
    return this.repo.delete(id, userId);
  }
}
