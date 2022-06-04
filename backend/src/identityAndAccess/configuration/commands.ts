import { RegisteredCommandHandler } from "../../sharedKernel/commandDispatcher"
import { UserRepository } from "../writes/domain/repositories/UserRepository"
import { CreateUserFactory } from "../writes/domain/services/CreateUserFactory"
import { RegisterUserCommand } from "../writes/usecases/RegisterUserCommand"
import { RegisterUserCommandHandler } from "../writes/usecases/RegisterUserCommandHandler"

export const identityAndAccessCommands = (repository: UserRepository, createUserFactory: CreateUserFactory): RegisteredCommandHandler => {
    
    return {
        [RegisterUserCommand.name]: new RegisterUserCommandHandler(repository, createUserFactory),
    }
}