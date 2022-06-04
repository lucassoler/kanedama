import { CommandHandler } from "../../../sharedKernel/commandHandler";
import { InvalidLoginOrPassword } from "../domain/errors/InvalidLoginOrPassword";
import { UserRepository } from "../domain/repositories/UserRepository";
import { EncryptionService } from "../domain/services/EncryptionService";
import { LoginCommand, LoginCommandResponse } from "./LoginCommand";

export class LoginCommandHandler implements CommandHandler {
    constructor(private readonly repository: UserRepository,
        private readonly encryptionService: EncryptionService) {
    }

    async handle(command: LoginCommand): Promise<LoginCommandResponse> {
        const user = await this.repository.getByUsernameOrEmail(command.login);

        if (user === null)
            throw new InvalidLoginOrPassword();

        if (!await this.encryptionService.compare(user.password, command.password)) {
            throw new InvalidLoginOrPassword();
        }

        return Promise.resolve({ name: user.name });
    }
}
