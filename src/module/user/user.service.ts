import { prisma } from '../../prisma/client';

type CreateUserInput = {
    email: string;
    name: string;
    password: string;
    phone?: string | null;
    status?: string;
};

type UpdateUserInput = Partial<{
    email: string;
    name: string;
    password: string;
    phone?: string | null;
    status?: string;
}>;

export class UserService {
    async create(data: CreateUserInput) {
        return prisma.user.create({
            data: {
                ...data,
                role: 'admin', // sempre admin para o dono do estabelecimento
            },
        });
    }

    async list() {
        return prisma.user.findMany();
    }

    async getById(id: number) {
        return prisma.user.findUnique({ where: { id } });
    }

    async update(id: number, data: UpdateUserInput) {
        const { email, name, password, phone, status } = data;
        return prisma.user.update({ where: { id }, data: { email, name, password, phone, status } });
    }

    async delete(id: number) {
        return prisma.user.delete({ where: { id } });
    }
}