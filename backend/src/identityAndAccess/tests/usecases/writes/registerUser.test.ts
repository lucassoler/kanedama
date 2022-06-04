import { DomainError } from "../../../../sharedKernel/domainError";
import { EmailAlreadyUsed } from "../../../writes/domain/errors/EmailAlreadyUsed";
import { EmailIsNotInAValidFormat } from "../../../writes/domain/errors/EmailIsNotInAValidFormat";
import { EmailIsTooLong } from "../../../writes/domain/errors/EmailIsTooLong";
import { PasswordIsNotLongEnough } from "../../../writes/domain/errors/PasswordIsNotLongEnough";
import { PasswordIsTooLong } from "../../../writes/domain/errors/PasswordIsTooLong";
import { UserInvalid } from "../../../writes/domain/errors/UserInvalid";
import { UserNameAlreadyUsed } from "../../../writes/domain/errors/UserNameAlreadyUsed";
import { UserNameIsNotLongEnough } from "../../../writes/domain/errors/UserNameIsNotLongEnough";
import { UserNameIsTooLong } from "../../../writes/domain/errors/UserNameIsTooLong";
import { UserRepositoryInMemory } from "../../../writes/driven/repositories/UserRepositoryInMemory";
import { CreateUserFactory } from "../../../writes/domain/services/CreateUserFactory";
import { FakeEncryptionService } from "../../../writes/driven/services/FakeEncryptionService";
import { RegisterUserCommand } from "../../../writes/usecases/RegisterUserCommand";
import { User } from "../../../writes/domain/User";
import { RegisterUserCommandHandler } from "../../../writes/usecases/RegisterUserCommandHandler";

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
    const EXPECTED_USER = {
        id: "3aae7614-9009-4a13-976b-2eeb57c656d4",
        name: NAME_VALID,
        email: EMAIL_VALID,
        password: PASSWORD_VALID
    };

    let repository: UserRepositoryInMemory;
    let createUserFactory: CreateUserFactory;
    let encryptionService: FakeEncryptionService;
    
    beforeEach(() => {
        repository = new UserRepositoryInMemory();
        encryptionService = new FakeEncryptionService();
        createUserFactory = new CreateUserFactory(repository, encryptionService);
    });

    test('should creates a new user', async () => {
        await createHandler().handle(createCommand(NAME_VALID,  EMAIL_VALID, PASSWORD_VALID));
        verifyPersistedUser(EXPECTED_USER);
    });

    test('password should be encrypted', async () => {
        await createHandler().handle(createCommand(NAME_VALID,  EMAIL_VALID, PASSWORD_VALID));
        verifyEncriptedPassword(PASSWORD_VALID);
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

        test('if a user already registered with this email', async () => {
            repository.save({ 
                id: "01a1b5be-7708-4396-ad32-053e0c473f2e", 
                name: "John Doe",
                email: "doe.family@gmail.com", 
                password: PASSWORD_VALID 
            });

            await expect(createHandler().handle(createCommand(NAME_VALID,  "doe.family@gmail.com", PASSWORD_VALID))).rejects.toThrowError(
                BuildUserInvalidErrors(new EmailAlreadyUsed("doe.family@gmail.com"))
            );
        });

        test('if a user already registered with this name', async () => {
            repository.save({ 
                id: "01a1b5be-7708-4396-ad32-053e0c473f2e", 
                name: "Jane Doe",
                email: "jane.doe.old.email@gmail.com", 
                password: PASSWORD_VALID 
            });

            await expect(createHandler().handle(createCommand("Jane Doe",  EMAIL_VALID, PASSWORD_VALID))).rejects.toThrowError(
                BuildUserInvalidErrors(new UserNameAlreadyUsed("Jane Doe"))
            );
        });
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

    function verifyEncriptedPassword(passwordToBeEncrypted: string) {
        expect(repository.users[0].password).toBe(`${passwordToBeEncrypted}_ENCRYPTED`);
    }

    function verifyPersistedUser(expectedUser: User) {
        expect(repository.users.length).toBe(1);
        expect(repository.users[0].id).toBe(expectedUser.id);
        expect(repository.users[0].name).toBe(expectedUser.name);
        expect(repository.users[0].email).toBe(expectedUser.email);
    }

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