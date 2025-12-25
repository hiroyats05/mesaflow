import { prisma } from '../../../prisma/client';

export type CreateUserDataTeam = {
    id: number,
    nome: string,
    login: string,
    password: string,
    empresa: number,
    funcao: 'caixa' | 'garcom' | 'entregador',
    status: 'ativo' | 'inativo' // essencial para o sistema de turnos de trabalho para entregadores
}

export type UpdateUserDataTeam = Partial<{
    name: string,
    login: string,
    password: string,
    funcao: 'caixa' | 'garcom' | 'entregador',
    status: 'ativo' | 'inativo',
}>

export type DTOresponseUserTeam = {
    name: string,
    function: 'caixa' | 'garcom' | 'entregador',
    status: 'ativo' | 'inativo',
}

export interface TeamRepository {
    create(data: Omit<CreateUserDataTeam, 'id'>): Promise<DTOresponseUserTeam>;
    listByEmpresa(empresa: number): Promise<DTOresponseUserTeam[]>;
    listAll(): Promise<DTOresponseUserTeam[]>;
    findById(id: number): Promise<DTOresponseUserTeam | null>;
    findByName(name: string, empresa: number): Promise<DTOresponseUserTeam | null>;
    update(id: number, data: UpdateUserDataTeam): Promise<{ count: number }>;
}

export class PrismaTeamRepository implements TeamRepository {
    // CRUD
    async create(data: Omit<CreateUserDataTeam, 'id'>) {
        const created = await prisma.team.create({ data });
        return {
            name: created.nome,
            function: created.funcao,
            status: created.status,
        } satisfies DTOresponseUserTeam;
    };

    async update(id: number, data: UpdateUserDataTeam) {
        return prisma.team.updateMany({ where: { id }, data })
    };

    async delete(id: number) {
        return prisma.team.deleteMany({ where: { id }});
    };

    // listagem

    async listByEmpresa(empresa: number) {
        const funcionarios = await prisma.team.findMany({
            where: { empresa },
            select: {
                nome: true,
                funcao: true,
                status: true,
            }
        });

        return funcionarios.map(funcionario => ({
            name: funcionario.nome,
            function: funcionario.funcao,
            status: funcionario.status,
        } satisfies DTOresponseUserTeam));
    }

    async listAll() {
        const funcionarios = await prisma.team.findMany({
            select: {
                nome: true,
                funcao: true,
                status: true,
            }
        });

        return funcionarios.map(funcionario => ({
            name: funcionario.nome,
            function: funcionario.funcao,
            status: funcionario.status,
        } satisfies DTOresponseUserTeam));
    }

    async findById(id: number) {
        const funcionario = await prisma.team.findUnique({
            where: { id },
            select: {
                nome: true,
                funcao: true,
                status: true,
            },
        });

        if (!funcionario) return null;

        return {
            name: funcionario.nome,
            function: funcionario.funcao,
            status: funcionario.status,
        } satisfies DTOresponseUserTeam;
    }

    async findByName(name: string, empresa: number) {
        const funcionario = await prisma.team.findFirst({
            where: { nome: name, empresa },
            select: {
                nome: true,
                funcao: true,
                status: true,
            },
        });

        if (!funcionario) return null;
        return {
            name: funcionario.nome,
            function: funcionario.funcao,
            status: funcionario.status,
        } satisfies DTOresponseUserTeam;
    }
}

