import { DataSource } from "typeorm";
import { NodeEnvironmentVariables } from "../../../../../configuration/environment/environmentVariables";
import { getDataSource } from "../../../../../configuration/typeorm/connection";
import { UserEntity } from "../../../../../configuration/typeorm/entities/UserEntity";
import { User } from "../../../../writes/domain/User";
import { UserRepositoryTypeOrm } from "../../../../writes/driven/repositories/UserRepositoryTypeOrm";
import { FakeUuidGenerator } from "../../../../writes/driven/services/FakeUuidGenerator";

describe('UserRepositoryTypeOrm - GetByUsernameOrEmail', () => {
    let repository: UserRepositoryTypeOrm;
    let fakeUuidGenerator: FakeUuidGenerator;
    let dataSource: DataSource;

    const USER_EXISTING = {
        id: "48614ce8-9778-4f31-abba-cc1b557a81fa",
        name: "Jane Doe",
        email: "jane.doe@gmail.com",
        password: "Password"
    };

    beforeAll(async () => {
        fakeUuidGenerator = new FakeUuidGenerator();
        dataSource = await getDataSource(new NodeEnvironmentVariables()).initialize();
        repository = new UserRepositoryTypeOrm(fakeUuidGenerator, dataSource);
        await repository.save(USER_EXISTING);
    });

    afterAll(async () => {
        await dataSource
            .createQueryBuilder()
            .delete()
            .from(UserEntity)
            .where("id = :id", { id: USER_EXISTING.id })
            .execute();
            

        dataSource.destroy();
    });

    test('should return user if login match with username', async () => {
        const persistedUser = await repository.getByUsernameOrEmail(USER_EXISTING.name);
        verifyPersistedUser(persistedUser, USER_EXISTING);
    });

    test('should return user if login match with email', async () => {
        const persistedUser = await repository.getByUsernameOrEmail(USER_EXISTING.email);
        verifyPersistedUser(persistedUser, USER_EXISTING);
    });

    test('should return null if login does not match with email and username', async () => {
        const persistedUser = await repository.getByUsernameOrEmail("NOT_EXISTING_USER");
        expect(persistedUser).toBeNull();
    });
});

function verifyPersistedUser(persistedUser: User | null, expectedUser: User) {
    expect(persistedUser).not.toBeNull();
    expect(persistedUser!.id).toStrictEqual(expectedUser.id);
    expect(persistedUser!.name).toStrictEqual(expectedUser.name);
    expect(persistedUser!.email).toStrictEqual(expectedUser.email);
    expect(persistedUser!.password).toStrictEqual(expectedUser.password);
}