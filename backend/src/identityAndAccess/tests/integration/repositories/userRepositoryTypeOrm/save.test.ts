import { DataSource } from "typeorm";
import { NodeEnvironmentVariables } from "../../../../../configuration/environment/environmentVariables";
import { getDataSource } from "../../../../../configuration/typeorm/connection";
import { UserEntity } from "../../../../../configuration/typeorm/entities/UserEntity";
import { UserRepositoryTypeOrm } from "../../../../writes/driven/repositories/UserRepositoryTypeOrm";
import { FakeUuidGenerator } from "../../../../writes/driven/services/FakeUuidGenerator";

describe('UserRepositoryTypeOrm - Save', () => {
    let repository: UserRepositoryTypeOrm;
    let fakeUuidGenerator: FakeUuidGenerator;
    let dataSource: DataSource;

    const USER_TO_PERSIST = {
        id: "f7eafd96-c194-4730-8de6-9da1c330bff3",
        name: "Jane Doe",
        email: "jane.doe@gmail.com",
        password: "Password"
    };

    beforeAll(async () => {
        dataSource = await getDataSource(new NodeEnvironmentVariables()).initialize();
        
    });

    beforeEach(() => {
        fakeUuidGenerator = new FakeUuidGenerator();
        repository = new UserRepositoryTypeOrm(fakeUuidGenerator, dataSource);
    });

    afterAll(async () => {
        await dataSource
            .createQueryBuilder()
            .delete()
            .from(UserEntity)
            .where("id = :id", { id: USER_TO_PERSIST.id })
            .execute();
            

        dataSource.destroy();
    });

    test('should persist user in database', async () => {
        await repository.save(USER_TO_PERSIST);
        const persistedUser = await retrievePersistedUser(dataSource, USER_TO_PERSIST.id);
        verifyPersistedUser(persistedUser, USER_TO_PERSIST);
    });
});

function verifyPersistedUser(persistedUser: UserEntity | null, USER_TO_PERSIST: { id: string; name: string; email: string; password: string; }) {
    expect(persistedUser).not.toBeNull();
    expect(persistedUser!.id).toStrictEqual(USER_TO_PERSIST.id);
    expect(persistedUser!.name).toStrictEqual(USER_TO_PERSIST.name);
    expect(persistedUser!.email).toStrictEqual(USER_TO_PERSIST.email);
    expect(persistedUser!.password).toStrictEqual(USER_TO_PERSIST.password);
}

async function retrievePersistedUser(dataSource: DataSource, userId: string) {
    return await dataSource.getRepository(UserEntity).createQueryBuilder("user").where("user.id = :id", { id: userId }).getOne();
}
