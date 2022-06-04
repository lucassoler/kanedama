import { UuidGenerator } from "../services/UuidGenerator";
import { UserRepository } from "../../domain/repositories/UserRepository";
import { User } from "../../domain/User";

export class UserRepositoryTypeOrm implements UserRepository {

    constructor(private readonly uuidGenerator: UuidGenerator) {
        
    }

    async nextId(): Promise<string> {
        return await this.uuidGenerator.generate();
    }

    save(user: User): Promise<void> {
        throw new Error("Method not implemented.");
    }

    isUsernameAlreadyUsed(name: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    isEmailAlreadyUsed(email: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
}