import { UserRepositoryInMemory } from "../../../writes/driven/repositories/UserRepositoryInMemory";
import { FakeEncryptionService } from "../../../writes/driven/services/FakeEncryptionService";
import { InvalidLoginOrPassword } from "../../../writes/domain/errors/InvalidLoginOrPassword";
import { LoginCommand } from "../../../writes/usecases/LoginCommand";
import { LoginCommandHandler } from "../../../writes/usecases/LoginCommandHandler";

describe('User login', () => {
    let repository: UserRepositoryInMemory;
    let encryptionService: FakeEncryptionService;
    const EXISTING_USER = {
        id: "3aae7614-9009-4a13-976b-2eeb57c656d4",
        name: "Jane Doe",
        email: "jane.doe@gmail.com",
        password: "Password_ENCRYPTED"
    };

    beforeEach(() => {
        repository = new UserRepositoryInMemory();
        encryptionService = new FakeEncryptionService();
        repository.users.push(EXISTING_USER)
    });

    test('should succeed with an valid name and password', async () => {
        const username = await createHandler().handle(createCommand());
        expect(username).toStrictEqual({name: EXISTING_USER.name});
    });

    test('should succeed with an valid email and password', async () => {
        const username = await createHandler().handle(createCommand("jane.doe@gmail.com"));
        expect(username).toStrictEqual({name: EXISTING_USER.name});
    });

    describe('throws an error', () => {
        test('if login passed does not match with username and password', async () => {
            await expect(createHandler().handle(createCommand("NotExistingUsername"))).rejects.toThrowError(new InvalidLoginOrPassword());
        });

        test('if password passed does not match with encrypted password', async () => {
            await expect(createHandler().handle(createCommand(EXISTING_USER.name, "INVALID_PASSWORD"))).rejects.toThrowError(new InvalidLoginOrPassword());
        });
    });

    function createHandler() {
        return new LoginCommandHandler(repository, encryptionService);
    }

    function createCommand(login: string = EXISTING_USER.name, password: string = "Password") {
        return new LoginCommand(login, password);
    }
});