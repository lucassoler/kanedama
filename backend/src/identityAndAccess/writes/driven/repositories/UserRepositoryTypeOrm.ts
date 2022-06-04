import { UuidGenerator } from "../services/UuidGenerator";
import { UserRepository } from "../../domain/repositories/UserRepository";
import { User } from "../../domain/User";
import { Column, DataSource, Entity, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "../../../../configuration/typeorm/entities/UserEntity";

export class UserRepositoryTypeOrm implements UserRepository {

    constructor(private readonly uuidGenerator: UuidGenerator,
        private readonly typeOrmDataSource: DataSource) {
        
    }
    async getByUsernameOrEmail(login: string): Promise<User | null> {
        const user = await this.typeOrmDataSource
            .getRepository(UserEntity)
            .createQueryBuilder("user")
            .where("user.name = :login")
            .orWhere("user.email = :login")
            .setParameters({ login: login })
            .getOne();

        return user ?? null;
    }

    async nextId(): Promise<string> {
        return await this.uuidGenerator.generate();
    }

    async save(user: User): Promise<void> {
        await this.typeOrmDataSource.createQueryBuilder()
        .insert()
        .into(UserEntity)
        .values({
            id: user.id,
            name: user.name,
            email: user.email,
            password: user.password
        })
        .execute();

        return Promise.resolve();
    }

    async isUsernameAlreadyUsed(name: string): Promise<boolean> {
        const existingUser = await this.typeOrmDataSource.getRepository(UserEntity).createQueryBuilder("user").where("user.name = :name", { name: name }).getOne();
        return existingUser !== null;
    }

    async isEmailAlreadyUsed(email: string): Promise<boolean> {
        const existingUser = await this.typeOrmDataSource.getRepository(UserEntity).createQueryBuilder("user").where("user.email = :email", { email: email }).getOne();
        return existingUser !== null;
    }
}