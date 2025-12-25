import { User } from '@prisma/client';
import { prisma } from '../../prisma/client';

export type CreateUserData = {
  email: string;
  name: string;
  password: string;
  phone?: string | null;
  status?: string;
  role?: string;
};

export type UpdateUserData = Partial<{
  email: string;
  name: string;
  password: string;
  phone?: string | null;
  status?: string;
  role?: string;
}>;

export interface UserRepository {
  create(data: CreateUserData): Promise<User>;
  list(): Promise<User[]>;
  listAll(): Promise<User[]>;
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByPhone(phone: string): Promise<User | null>;
  update(id: number, data: UpdateUserData): Promise<User>;
  delete(id: number): Promise<User>;
}

export class PrismaUserRepository implements UserRepository {
  async create(data: CreateUserData) {
    return prisma.user.create({ data });
  }

  async list() {
    return prisma.user.findMany();
  }

  async listAll() {
    return prisma.user.findMany();
  }

  async findById(id: number) {
    return prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async findByPhone(phone: string) {
    return prisma.user.findUnique({ where: { phone } });
  }

    //uso deve ser feito para evitar expor informações sensiveis
  async DTOresponseUser(user: User) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
    }
  }

  async update(id: number, data: UpdateUserData) {
    return prisma.user.update({ where: { id }, data });
  }

  async delete(id: number) {
    return prisma.user.delete({ where: { id } });
  }
}
