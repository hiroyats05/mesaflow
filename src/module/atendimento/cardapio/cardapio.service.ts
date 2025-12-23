import { PrismaCardapioRepository, CardapioRepository, CreateCardapioData, UpdateCardapioData } from './cardapio.repository';

export class CardapioService {
    constructor(private readonly repo: CardapioRepository = new PrismaCardapioRepository()) {}

    async create(data: Omit<CreateCardapioData, 'id'>) {
        return this.repo.create(data as CreateCardapioData);
    }

    async list() {
        return this.repo.list();
    }

    async getById(id: number) {
        return this.repo.findById(id);
    }

    async update(id: number, data: UpdateCardapioData) {
        return this.repo.update(id, data);
    }

    async delete(id: number) {
        return this.repo.delete(id);
    }
}