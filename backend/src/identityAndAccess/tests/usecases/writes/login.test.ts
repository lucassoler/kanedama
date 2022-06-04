import { Command } from "../../../../sharedKernel/command";
import { CommandHandler } from "../../../../sharedKernel/commandHandler";
import { DomainError } from "../../../../sharedKernel/domainError";
import IdentityErrorCodes from "../../../writes/domain/errors/IdentityErrorCodes";
import { UserRepository } from "../../../writes/domain/repositories/UserRepository";
import { UserRepositoryInMemory } from "../../../writes/driven/repositories/UserRepositoryInMemory";

describe('User login', () => {
    let repository: UserRepositoryInMemory;
    const EXISTING_USER = {
        id: "3aae7614-9009-4a13-976b-2eeb57c656d4",
        name: "Jane Doe",
        email: "jane.doe@gmail.com",
        password: "Password_ENCRYPTED"
    };

    beforeEach(() => {
        repository = new UserRepositoryInMemory();
        repository.users.push(EXISTING_USER)
    });

    test('should succeed with an valid name and password', async () => {
        const username = await createHandler().handle(createCommand());
        expect(username).toStrictEqual({name: "Jane Doe"});
    });

    test('should succeed with an valid email and password', async () => {
        const username = await createHandler().handle(createCommand("jane.doe@gmail.com"));
        expect(username).toStrictEqual({name: "Jane Doe"});
    });

    describe('throws an error', () => {
        test('if user name not found', async () => {
            await expect(createHandler().handle(createCommand("NotExistingUsername"))).rejects.toThrowError(new InvalidLoginOrPassword());
        });
    });

    function createHandler() {
        return new LoginCommandHandler(repository);
    }

    function createCommand(login: string = "Jane Doe") {
        return new LoginCommand(login);
    }
});

class InvalidLoginOrPassword extends DomainError {
    code: string = IdentityErrorCodes.InvalidLoginOrPassword;

    constructor() {
        super("invalid login or password");
    }

}

class LoginCommand implements Command  {
    constructor(readonly login: string) {
        
    }
}

class LoginCommandHandler implements CommandHandler {
    constructor(private readonly repository: UserRepository) {

    }

    async handle(command: LoginCommand): Promise<LoginCommandResponse> {
        const user = await this.repository.getByUsernameOrEmail(command.login);

        if (user === null) throw new InvalidLoginOrPassword();

        return Promise.resolve({name: user.name});
    }
}

type LoginCommandResponse = {
    name: string
}
