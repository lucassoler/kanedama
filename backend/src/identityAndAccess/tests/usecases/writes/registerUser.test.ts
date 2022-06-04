import { Command } from "../../../../sharedKernel/command";
import { CommandHandler } from "../../../../sharedKernel/commandHandler";

describe('Register user', () => {
    let repository: UserRepositoryInMemory;
    
    beforeEach(() => {
        repository = new UserRepositoryInMemory();
    });
    describe('register a new user', () => {
        test('should creates a new user', async () => {
            const expectedUser = { 
                id: "3aae7614-9009-4a13-976b-2eeb57c656d4", 
                name: "Jane Doe",
                email: "jane.doe@gmail.com", 
                password: "password" 
            };
            
            await createHandler().handle(createCommand("Jane Doe",  "jane.doe@gmail.com", "password"));
            expect(repository.users.length).toBe(1);
            expect(repository.users[0]).toStrictEqual(expectedUser);
        });
    });

    function createHandler() {
        return new RegisterUserCommandHandler(repository);
    }
    
    function createCommand(name: string, email: string, password: string) {
        return new RegisterUserCommand(name, email, password);
    }
    
});

interface UserRepository {
    nextId(): Promise<string>;
    save(user: User): Promise<void>;
}

class UserRepositoryInMemory implements UserRepository {
    users: Array<User> = [];
    nextIdToReturn: string = "3aae7614-9009-4a13-976b-2eeb57c656d4";

    nextId(): Promise<string> {
        return Promise.resolve(this.nextIdToReturn);
    }

    async save(user: User): Promise<void> {
        this.users.push(user);
        return Promise.resolve();
    }
}

class RegisterUserCommand implements Command {
    constructor(readonly name: string, 
        readonly email: string, 
        readonly password: string) {

    }
}

class RegisterUserCommandHandler implements CommandHandler {
    constructor(private repository : UserRepository) {

    }

    async handle(command: RegisterUserCommand): Promise<void> {
        const user: User = { 
            id: await this.repository.nextId(),
            name: command.name,
            email: command.email,
            password: command.password 
        };
        await this.repository.save(user);
    }
}

type User = {
    id: string,
    name: string,
    email: string, 
    password: string
}