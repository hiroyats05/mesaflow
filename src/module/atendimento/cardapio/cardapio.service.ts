import { PrismaCardapioRepository, CardapioRepository, CreateCardapioData, UpdateCardapioData } from './cardapio.repository';

export class CardapioService {
    constructor(private readonly repo: CardapioRepository = new PrismaCardapioRepository()) {}

    async create(data: Omit<CreateCardapioData, 'id'>) {
        return this.repo.create(data as CreateCardapioData);
    }

    async update(id: number, data: UpdateCardapioData) {
        return this.repo.update(id, data);
    }

    async delete(id: number) {
        return this.repo.delete(id);
    }

    async listByEmpresa(empresa: number) {
        return this.repo.listByEmpresa(empresa);
    }

    async listAll() {
        return this.repo.listAll();
    }

    async getById(id: number) {
        return this.repo.findById(id);
    }

    async getByName(nome: string, empresa: number) {
        return this.repo.findByName(nome, empresa);
    }
}