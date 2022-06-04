import { Command } from "../../../../sharedKernel/command";
import { CommandHandler } from "../../../../sharedKernel/commandHandler";

describe('Register user', () => {
    const NAME_VALID = "Jane Doe";
    const NAME_TOO_SHORT = "Jan";
    const NAME_TOO_LONG = "Lorem ipsum dolor sit amet, consectetur vestibulum.";
    const EMAIL_VALID = "jane.doe@gmail.com";
    const EMAIL_INVALID_FORMAT = "invalidemail";
    const EMAIL_TOO_LONG = "lzsepenhakfmagspsgswxozgldvagpeyfmxgisechnvsnjnuatxglcuelqd@hdaqxzufghftauzavuisurphtvzlpxtixmrlducgvknxrphfzwirrnheptsvfwgaszuvunuinvxtwdcbuhjnieiboihxaydgkwqqvmqrraotyydcmvgghgemuzwtftmjmopjmiuhnzxydjnodwfjhvevhuanvxetzlbdorkjjzdafotdvpgdabaakolffouzqjwjkk";
    const PASSWORD_TOO_SHORT = "Pass";
    const PASSWORD_TOO_LONG = "lzsepenhakfmagspsgswxozgldvagpeyfmxgisechnvsnjnuatxglcuelqdhdaqxzufghftauzavuisurphtvzlpxtixmrlducgvknxrphfzwirrnheptsvfwgaszuvunuinvxtwdcbuhjnieiboihxaydgkwqqvmqrraotyydcmvgghgemuzwtftmjmopjmiuhnzxydjnodwfjhvevhuanvxetzlbdorkjjzdafotdvpgdabaakolffouzqjwjkk";

    let repository: UserRepositoryInMemory;
    
    beforeEach(() => {
        repository = new UserRepositoryInMemory();
    });

    describe('register a new user', () => {
        test('should creates a new user', async () => {
            const expectedUser = { 
                id: "3aae7614-9009-4a13-976b-2eeb57c656d4", 
                name: NAME_VALID,
                email: EMAIL_VALID, 
                password: "password" 
            };

            await createHandler().handle(createCommand(NAME_VALID,  EMAIL_VALID, "password"));
            expect(repository.users.length).toBe(1);
            expect(repository.users[0]).toStrictEqual(expectedUser);
        });
    });

    describe('throws an error', () => {
        test('if name length is not long enough', async () => {
            await expect(createHandler().handle(createCommand(NAME_TOO_SHORT))).rejects.toThrowError(new UserNameIsNotLongEnough(NAME_TOO_SHORT));
        });

        test('if name length is too long', async () => {
            await expect(createHandler().handle(createCommand(NAME_TOO_LONG))).rejects.toThrowError(new UserNameIsTooLong(NAME_TOO_LONG));
        });

        test('if email is not valid', async () => {
            await expect(createHandler().handle(createCommand(NAME_VALID, EMAIL_INVALID_FORMAT))).rejects.toThrowError(new EmailIsNotInAValidFormat(EMAIL_INVALID_FORMAT));
        });

        test('if email is too long', async () => {
            await expect(createHandler().handle(createCommand(NAME_VALID, EMAIL_TOO_LONG))).rejects.toThrowError(new EmailIsTooLong(EMAIL_TOO_LONG));
        });

        test('if password length is not long enough', async () => {
            await expect(createHandler().handle(createCommand(NAME_VALID, EMAIL_VALID, PASSWORD_TOO_SHORT))).rejects.toThrowError(new PasswordIsNotLongEnough(PASSWORD_TOO_SHORT));
        });

        test('if password length is too long', async () => {
            await expect(createHandler().handle(createCommand(NAME_VALID, EMAIL_VALID, PASSWORD_TOO_LONG))).rejects.toThrowError(new PasswordIsTooLong(PASSWORD_TOO_LONG));
        });
    });

    function createHandler() {
        return new RegisterUserCommandHandler(repository);
    }
    
    function createCommand(name: string = NAME_VALID, email: string = EMAIL_VALID, password: string = "password") {
        return new RegisterUserCommand(name, email, password);
    }
    
});

class EmailIsTooLong extends Error {
    constructor(email: string) {
        super(`email "${email}" is too long`);
    }
}

class EmailIsNotInAValidFormat extends Error {

    constructor(email: string) {
        super(`email "${email}" is not a valid email format`);
    }
}

class UserNameIsNotLongEnough extends Error {
    constructor(name: string) {
        super(`username "${name}" is not long enough`);
    }
}

class UserNameIsTooLong extends Error {
    constructor(name: string) {
        super(`username "${name}" is too long`);
    }
}

class PasswordIsNotLongEnough extends Error {
    constructor(name: string) {
        super(`password "${name}" is not long enough`);
    }
}

class PasswordIsTooLong extends Error {
    constructor(name: string) {
        super(`password "${name}" is too long`);
    }
}

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
        const user: User = createUserFactory(await this.repository.nextId(), command.name, command.email, command.password);

        await this.repository.save(user);
    }
}

type User = {
    id: string,
    name: string,
    email: string, 
    password: string
}

function createUserFactory(id: string, name: string, email: string, password: string) {
    if (name.length < 4) {
        throw new UserNameIsNotLongEnough(name);
    }

    if (name.length > 50) {
        throw new UserNameIsTooLong(name);
    }

    if (!email.includes("@")) {
        throw new EmailIsNotInAValidFormat(email);
    }

    if (email.length > 256) {
        throw new EmailIsTooLong(email);
    }

    if (password.length < 8) {
        throw new PasswordIsNotLongEnough(password);
    }

    if (password.length > 255) {
        throw new PasswordIsTooLong(password);
    }

    const user: User = {
        id,
        name,
        email,
        password
    };

    return user;
}
