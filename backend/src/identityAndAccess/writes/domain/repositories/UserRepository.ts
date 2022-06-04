import { User } from "../User";

export interface UserRepository {
    getByUsernameOrEmail(login: string): Promise<User | null>;
    nextId(): Promise<string>;
    save(user: User): Promise<void>;
    isUsernameAlreadyUsed(name: string): Promise<boolean>;
    isEmailAlreadyUsed(email: string): Promise<boolean>;
}
