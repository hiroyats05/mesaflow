import { PrismaTeamRepository, TeamRepository, CreateUserDataTeam, UpdateUserDataTeam, DTOresponseUserTeam } from './team.repository';

export class TeamService {
    constructor(private readonly repo: TeamRepository = new PrismaTeamRepository()) {}


    //CRUD
    async create(data: Omit<CreateUserDataTeam, 'id'>) {
        return this.repo.create(data);
    }

    async update(data: UpdateUserDataTeam, id: number) {
        return this.repo.update(id, data);
    }

    async delete(id: number) {
        return this.repo.delete(id);
    }

    // LISTAGEM
    async listByEmpresa(empresa: string): Promise<DTOresponseUserTeam[]> {
        return this.repo.listByEmpresa(Number(empresa));
    }

    async listAll(): Promise<DTOresponseUserTeam[]> {
        return this.repo.listAll();
    }

    async getById(id: number): Promise<DTOresponseUserTeam | null> {
        return this.repo.findById(id);
    }
    async getByName(name: string, empresa: number): Promise<DTOresponseUserTeam | null> {
        return this.repo.findByName(name, empresa);
    }


}