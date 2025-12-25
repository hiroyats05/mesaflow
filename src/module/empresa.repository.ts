import { prisma } from '../../lib/prisma';

export type CreateEmpresaData = {
    id: number;
    userId: number;
    nome: string;
}

export type UpdateEmpresaData = Partial<{
    nome: string;
}>;

export type DTOresponseEmpresa = {
    nome: string;
}

export interface EmpresaRepository {
    create(data: Omit<CreateEmpresaData, 'id'>): Promise<CreateEmpresaData>;
    list(): Promise<DTOresponseEmpresa[]>;
    findById(id: number): Promise<DTOresponseEmpresa | null>;
    update(id: number, data: UpdateEmpresaData): Promise<{ count: number }>;
    delete(id: number): Promise<{ count: number }>;
}

export class PrismaEmpresaRepository implements EmpresaRepository {
    // CRUD
    async create(data: Omit<CreateEmpresaData, 'id'>) {
        return prisma.empresa.create({ data });
    }

    async update(id: number, data: UpdateEmpresaData) {
        return prisma.empresa.updateMany({ where: { id }, data });
    }

    async delete(id: number) {
        return prisma.empresa.deleteMany({ where: { id }});
    }

    // listagem
    async list() {
        const items = await prisma.empresa.findMany({
            select: { 
                nome: true
            }
        });

        return items.map(empresa => ({
            nome: empresa.nome,
        }) satisfies DTOresponseEmpresa);        
    }

    async findById(id: number) {
        const item = await prisma.empresa.findUnique({ 
            where: { id } ,
            select: {
                nome: true
            }
        });

        if (!item) {
            return null;
        }

        return {
            nome: item.nome
        } satisfies DTOresponseEmpresa;
        
    }
}