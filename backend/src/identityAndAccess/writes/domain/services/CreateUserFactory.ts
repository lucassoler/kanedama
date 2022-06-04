import { DomainError } from "../../../../sharedKernel/domainError";
import { EmailAlreadyUsed } from "../errors/EmailAlreadyUsed";
import { EmailIsNotInAValidFormat } from "../errors/EmailIsNotInAValidFormat";
import { EmailIsTooLong } from "../errors/EmailIsTooLong";
import { PasswordIsNotLongEnough } from "../errors/PasswordIsNotLongEnough";
import { PasswordIsTooLong } from "../errors/PasswordIsTooLong";
import { UserInvalid } from "../errors/UserInvalid";
import { UserNameAlreadyUsed } from "../errors/UserNameAlreadyUsed";
import { UserNameIsNotLongEnough } from "../errors/UserNameIsNotLongEnough";
import { UserNameIsTooLong } from "../errors/UserNameIsTooLong";
import { UserRepository } from "../repositories/UserRepository";
import { EncryptionService } from "./EncryptionService";
import { User } from "../User";


export class CreateUserFactory {
    constructor(private readonly repository: UserRepository,
        private readonly encryptionService: EncryptionService) {
    }

    async create(name: string, email: string, password: string): Promise<User> {
        await this.verifyUserToBeCreated(name, email, password);

        const id = await this.repository.nextId();
        const encryptedPassword = await this.encryptionService.encrypt(password);

        const user: User = {
            id,
            name,
            email,
            password: encryptedPassword
        };

        return user;
    }

    private async verifyUserToBeCreated(name: string, email: string, password: string) {
        var errors: Array<DomainError> = [
            ...await this.verifyUsername(name),
            ...await this.verifyEmail(email),
            ...this.verifyPassword(password)
        ];

        if (errors.length > 0) {
            throw new UserInvalid(errors);
        }
    }

    verifyPassword(password: string): Array<DomainError> {
        var errors: Array<DomainError> = [];

        if (password.length < 8) {
            errors.push(new PasswordIsNotLongEnough(password));
        }

        if (password.length > 255) {
            errors.push(new PasswordIsTooLong(password));
        }

        return errors;
    }

    async verifyEmail(email: string): Promise<Array<DomainError>> {
        var errors: Array<DomainError> = [];

        if (!email.includes("@")) {
            errors.push(new EmailIsNotInAValidFormat(email));
        }

        if (email.length > 256) {
            errors.push(new EmailIsTooLong(email));
        }

        if (await this.repository.isEmailAlreadyUsed(email)) {
            errors.push(new EmailAlreadyUsed(email));
        }

        return errors;
    }

    async verifyUsername(name: string): Promise<Array<DomainError>> {
        var errors: Array<DomainError> = [];

        if (name.length < 4) {
            errors.push(new UserNameIsNotLongEnough(name));
        }

        if (name.length > 50) {
            errors.push(new UserNameIsTooLong(name));
        }

        if (await this.repository.isUsernameAlreadyUsed(name)) {
            errors.push(new UserNameAlreadyUsed(name));
        }

        return errors;
    }
}
