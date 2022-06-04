import { UserRepository } from "../../domain/repositories/UserRepository";
import { User } from "../../domain/User";

export class UserRepositoryInMemory implements UserRepository {
    users: Array<User> = [];
    nextIdToReturn: string = "3aae7614-9009-4a13-976b-2eeb57c656d4";

    nextId(): Promise<string> {
        return Promise.resolve(this.nextIdToReturn);
    }

    isEmailAlreadyUsed(email: string): Promise<boolean> {
        if (this.users.find(x => x.email === email)) {
            return Promise.resolve(true);
        }

        return Promise.resolve(false);
    }

    isUsernameAlreadyUsed(name: string): Promise<boolean> {
        if (this.users.find(x => x.name === name)) {
            return Promise.resolve(true);
        }

        return Promise.resolve(false);
    }

    save(user: User): Promise<void> {
        this.users.push(user);
        return Promise.resolve();
    }
}
