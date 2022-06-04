import { CommandHandler } from "../../../sharedKernel/commandHandler";
import { UserRepository } from "../domain/repositories/UserRepository";
import { CreateUserFactory } from "../domain/services/CreateUserFactory";
import { User } from "../domain/User";
import { RegisterUserCommand } from "./RegisterUserCommand";

export class RegisterUserCommandHandler implements CommandHandler {
    constructor(private readonly repository: UserRepository,
        private readonly createUserFactory: CreateUserFactory) {
    }

    async handle(command: RegisterUserCommand): Promise<void> {
        const user: User = await this.createUserFactory.create(command.name, command.email, command.password);
        await this.repository.save(user);
    }
}
