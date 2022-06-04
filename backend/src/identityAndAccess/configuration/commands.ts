import { RegisteredCommandHandler } from "../../sharedKernel/commandDispatcher"
import { UserRepository } from "../writes/domain/repositories/UserRepository"
import { CreateUserFactory } from "../writes/domain/services/CreateUserFactory"
import { EncryptionService } from "../writes/domain/services/EncryptionService"
import { LoginCommand } from "../writes/usecases/LoginCommand"
import { LoginCommandHandler } from "../writes/usecases/LoginCommandHandler"
import { RegisterUserCommand } from "../writes/usecases/RegisterUserCommand"
import { RegisterUserCommandHandler } from "../writes/usecases/RegisterUserCommandHandler"

export const identityAndAccessCommands = (repository: UserRepository, createUserFactory: CreateUserFactory, encryptionService: EncryptionService): RegisteredCommandHandler => {
    
    return {
        [RegisterUserCommand.name]: new RegisterUserCommandHandler(repository, createUserFactory),
        [LoginCommand.name]: new LoginCommandHandler(repository, encryptionService),
    }
}