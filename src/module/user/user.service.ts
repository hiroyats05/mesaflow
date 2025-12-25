import { AuthService } from '../../auth/auth.service';
import { PrismaUserRepository, UserRepository, CreateUserData, UpdateUserData } from './user.repository';

const authService = new AuthService();

export class UserService {
    constructor(private readonly repo: UserRepository = new PrismaUserRepository()) {}

    async create(data: CreateUserData) {
        const hashedPassword = await authService.hashPassword(data.password);
        
        return this.repo.create({
            ...data,
            password: hashedPassword,
            role: data.role ?? 'user',
        });
    }

    async list() {
        return this.repo.list();
    }

    async listAll() {
        return this.repo.listAll();
    }

    async getById(id: number) {
        return this.repo.findById(id);
    }

    async findByEmail(email: string) {
        return this.repo.findByEmail(email);
    }

    async findByPhone(phone: string) {
        return this.repo.findByPhone(phone);
    }

    async update(id: number, data: UpdateUserData) {
        const { email, name, password, phone, status, role } = data;
        
        const updateData: any = { email, name, phone, status, role };
        if (password) {
            updateData.password = await authService.hashPassword(password);
        }
        
        return this.repo.update(id, updateData);
    }

    async delete(id: number) {
        return this.repo.delete(id);
    }
}