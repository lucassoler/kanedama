import { Command } from "../../../../sharedKernel/command";
import { CommandHandler } from "../../../../sharedKernel/commandHandler";
import { DomainError } from "../../../../sharedKernel/domainError";

describe('Register user', () => {
    const NAME_VALID = "Jane Doe";
    const NAME_TOO_SHORT = "Jan";
    const NAME_TOO_LONG = "Lorem ipsum dolor sit amet, consectetur vestibulum.";
    const EMAIL_VALID = "jane.doe@gmail.com";
    const EMAIL_INVALID_FORMAT = "invalidemail";
    const EMAIL_TOO_LONG = "lzsepenhakfmagspsgswxozgldvagpeyfmxgisechnvsnjnuatxglcuelqd@hdaqxzufghftauzavuisurphtvzlpxtixmrlducgvknxrphfzwirrnheptsvfwgaszuvunuinvxtwdcbuhjnieiboihxaydgkwqqvmqrraotyydcmvgghgemuzwtftmjmopjmiuhnzxydjnodwfjhvevhuanvxetzlbdorkjjzdafotdvpgdabaakolffouzqjwjkk";
    const PASSWORD_VALID = "Password";
    const PASSWORD_TOO_SHORT = "Pass";
    const PASSWORD_TOO_LONG = "lzsepenhakfmagspsgswxozgldvagpeyfmxgisechnvsnjnuatxglcuelqdhdaqxzufghftauzavuisurphtvzlpxtixmrlducgvknxrphfzwirrnheptsvfwgaszuvunuinvxtwdcbuhjnieiboihxaydgkwqqvmqrraotyydcmvgghgemuzwtftmjmopjmiuhnzxydjnodwfjhvevhuanvxetzlbdorkjjzdafotdvpgdabaakolffouzqjwjkk";

    let repository: UserRepositoryInMemory;
    let createUserFactory: CreateUserFactory;
    
    beforeEach(() => {
        repository = new UserRepositoryInMemory();
        createUserFactory = new CreateUserFactory(repository);
    });

    describe('register a new user', () => {
        test('should creates a new user', async () => {
            const expectedUser = { 
                id: "3aae7614-9009-4a13-976b-2eeb57c656d4", 
                name: NAME_VALID,
                email: EMAIL_VALID, 
                password:PASSWORD_VALID 
            };

            await createHandler().handle(createCommand(NAME_VALID,  EMAIL_VALID, PASSWORD_VALID));
            expect(repository.users.length).toBe(1);
            expect(repository.users[0]).toStrictEqual(expectedUser);
        });
    });

    describe('throws an error', () => {
        test('if name length is not long enough', async () => {
            await expect(createHandler().handle(createCommand(NAME_TOO_SHORT))).rejects.toThrowError(
                BuildUserInvalidErrors(new UserNameIsNotLongEnough(NAME_TOO_SHORT))
            );
        });

        test('if name length is too long', async () => {
            await expect(createHandler().handle(createCommand(NAME_TOO_LONG))).rejects.toThrowError(
                BuildUserInvalidErrors(new UserNameIsTooLong(NAME_TOO_LONG))
            );
        });

        test('if email is not valid', async () => {
            await expect(createHandler().handle(createCommand(NAME_VALID, EMAIL_INVALID_FORMAT))).rejects.toThrowError(
                BuildUserInvalidErrors(new EmailIsNotInAValidFormat(EMAIL_INVALID_FORMAT))
            );
        });

        test('if email is too long', async () => {
            await expect(createHandler().handle(createCommand(NAME_VALID, EMAIL_TOO_LONG))).rejects.toThrowError(
                BuildUserInvalidErrors(new EmailIsTooLong(EMAIL_TOO_LONG))
            );
        });

        test('if password length is not long enough', async () => {
            await expect(createHandler().handle(createCommand(NAME_VALID, EMAIL_VALID, PASSWORD_TOO_SHORT))).rejects.toThrowError(
                BuildUserInvalidErrors(new PasswordIsNotLongEnough(PASSWORD_TOO_SHORT))
            );
        });

        test('if password length is too long', async () => {
            await expect(createHandler().handle(createCommand(NAME_VALID, EMAIL_VALID, PASSWORD_TOO_LONG))).rejects.toThrowError(
                BuildUserInvalidErrors(new PasswordIsTooLong(PASSWORD_TOO_LONG))
            );
        });

        /*test('if a user already registered with this email', async () => {
            repository.save({ 
                id: "01a1b5be-7708-4396-ad32-053e0c473f2e", 
                name: "John Doe",
                email: "doe.family@gmail.com", 
                password: PASSWORD_VALID 
            });

            await expect(createHandler().handle(createCommand(NAME_VALID,  "doe.family@gmail.com", PASSWORD_VALID))).rejects.toThrowError(
                BuildUserInvalidErrors(new EmailAlreadyUsed("doe.family@gmail.com"))
            );
            
        });*/
    });

    describe('throws multiple errors', () => {
        test('if name, email and password are invalids', async () => {
            await expect(createHandler().handle(createCommand(NAME_TOO_SHORT, EMAIL_INVALID_FORMAT, PASSWORD_TOO_SHORT))).rejects.toThrowError(
                BuildUserInvalidErrors(
                    new UserNameIsNotLongEnough(NAME_TOO_SHORT),
                    new EmailIsNotInAValidFormat(EMAIL_INVALID_FORMAT),
                    new PasswordIsNotLongEnough(PASSWORD_TOO_SHORT)
                )
            );
        });
    });

    function BuildUserInvalidErrors(...errors: DomainError[]) {
        return new UserInvalid(errors);
    }

    function createHandler() {
        return new RegisterUserCommandHandler(repository, createUserFactory);
    }
    
    function createCommand(name: string = NAME_VALID, email: string = EMAIL_VALID, password: string = PASSWORD_VALID) {
        return new RegisterUserCommand(name, email, password);
    }
    
});

class EmailAlreadyUsed extends DomainError {
    readonly code = IdentityErrorCodes.EmailAlreadyUsed;

    constructor(email: string) {
        super(`email "${email}" is already used by another registered user`);
    }

}

class UserInvalid extends DomainError {
    readonly errors: Array<DomainError>;
    readonly code = IdentityErrorCodes.UserInvalid;

    constructor(errors: Array<DomainError>) {
        super("user is invalid");
        this.errors = errors;
    }
}

class EmailIsTooLong extends DomainError {
    readonly code = IdentityErrorCodes.EmailIsTooLong;

    constructor(email: string) {
        super(`email "${email}" is too long`);
    }
}

class EmailIsNotInAValidFormat extends DomainError {
    readonly code = IdentityErrorCodes.EmailIsNotInAValidFormat;

    constructor(email: string) {
        super(`email "${email}" is not a valid email format`);
    }
}

class UserNameIsNotLongEnough extends DomainError {
    readonly code = IdentityErrorCodes.UserNameIsNotLongEnough;

    constructor(name: string) {
        super(`username "${name}" is not long enough`);
    }
}

class UserNameIsTooLong extends DomainError {
    readonly code = IdentityErrorCodes.UserNameIsTooLong;

    constructor(name: string) {
        super(`username "${name}" is too long`);
    }
}

class PasswordIsNotLongEnough extends DomainError {
    readonly code = IdentityErrorCodes.PasswordIsNotLongEnough;

    constructor(name: string) {
        super(`password "${name}" is not long enough`);
    }
}

class PasswordIsTooLong extends DomainError {
    readonly code = IdentityErrorCodes.PasswordIsTooLong;

    constructor(name: string) {
        super(`password "${name}" is too long`);
    }
}

class IdentityErrorCodes {
    private static readonly IDENTITY_ERROR_CODE = "IDENTITY_ERR_";

    static readonly UserInvalid = IdentityErrorCodes.concatErrorCode("4000");
    static readonly UserNameIsNotLongEnough = IdentityErrorCodes.concatErrorCode("4001");
    static readonly UserNameIsTooLong = IdentityErrorCodes.concatErrorCode("4002");
    static readonly PasswordIsNotLongEnough = IdentityErrorCodes.concatErrorCode("4003");
    static readonly PasswordIsTooLong = IdentityErrorCodes.concatErrorCode("4004");
    static readonly EmailIsTooLong = IdentityErrorCodes.concatErrorCode("4005");
    static readonly EmailIsNotInAValidFormat = IdentityErrorCodes.concatErrorCode("4006");
    static readonly EmailAlreadyUsed = IdentityErrorCodes.concatErrorCode("4007");

    private static concatErrorCode(error: string) {
        return IdentityErrorCodes.IDENTITY_ERROR_CODE + error;
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
    constructor(private repository : UserRepository,
        private createUserFactory: CreateUserFactory) {

    }

    async handle(command: RegisterUserCommand): Promise<void> {
        const user: User = await this.createUserFactory.create(command.name, command.email, command.password);
        await this.repository.save(user);
    }
}

type User = {
    id: string,
    name: string,
    email: string, 
    password: string
}

class CreateUserFactory {
    constructor(private repository : UserRepository) {

    }

    async create(name: string, email: string, password: string): Promise<User> {
        var errors: Array<DomainError> = [
            ...this.verifyUsername(name),
            ...this.verifyEmail(email),
            ...this.verifyPassword(password)
        ];
    
        if (errors.length > 0) {
            throw new UserInvalid(errors);
        }

        const id = await this.repository.nextId();
    
        const user: User = {
            id,
            name,
            email,
            password
        };
    
        return user;
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
    
    verifyEmail(email: string): Array<DomainError> {
        var errors: Array<DomainError> = [];
    
        if (!email.includes("@")) {
            errors.push(new EmailIsNotInAValidFormat(email));
        }
    
        if (email.length > 256) {
            errors.push(new EmailIsTooLong(email));
        }
    
        return errors;
    }
    
    verifyUsername(name: string): Array<DomainError> {
        var errors: Array<DomainError> = [];
    
        if (name.length < 4) {
            errors.push(new UserNameIsNotLongEnough(name));
        }
    
        if (name.length > 50) {
            errors.push(new UserNameIsTooLong(name));
        }
    
        return errors;
    }
}