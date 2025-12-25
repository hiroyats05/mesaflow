import { PrismaEmpresaRepository } from "./empresa.repository";
import { CreateEmpresaData, UpdateEmpresaData } from "./empresa.repository";

export class EmpresaService {
    private readonly repo: PrismaEmpresaRepository;

    constructor() {
        this.repo = new PrismaEmpresaRepository();
    }

    //CRUD

    async create(data: CreateEmpresaData) {
        return this.repo.create(data);
    }

    async update(data: UpdateEmpresaData) {
        return this.repo.update(data);
    }

    async delete(id: number) {
        return this.repo.delete(id);
    }

    // listagem

    async list() {
        return this.repo.list();
    }

    async getById(id: number) {
        return this.repo.findById(id);
    }
}