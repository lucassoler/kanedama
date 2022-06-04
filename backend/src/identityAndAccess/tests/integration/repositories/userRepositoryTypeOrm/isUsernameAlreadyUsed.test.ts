import { DataSource } from "typeorm";
import { NodeEnvironmentVariables } from "../../../../../configuration/environment/environmentVariables";
import { getDataSource } from "../../../../../configuration/typeorm/connection";
import { UserEntity } from "../../../../../configuration/typeorm/entities/UserEntity";
import { UserRepositoryTypeOrm } from "../../../../writes/driven/repositories/UserRepositoryTypeOrm";
import { FakeUuidGenerator } from "../../../../writes/driven/services/FakeUuidGenerator";

describe('UserRepositoryTypeOrm - IsUsernameAlreadyUsed', () => {
    let repository: UserRepositoryTypeOrm;
    let fakeUuidGenerator: FakeUuidGenerator;
    let dataSource: DataSource;

    const USER_EXISTING = {
        id: "63aff7d1-f3f9-4eb1-8a1a-46452a76a5e1",
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
            .where("id = :id", { id: USER_EXISTING.id })
            .execute();
            

        dataSource.destroy();
    });

    test('should return false if no user exists with this username', async () => {
        await expect(repository.isUsernameAlreadyUsed(USER_EXISTING.name)).resolves.toBeFalsy();
    });

    test('should return true if a user already exists with this username', async () => {
        await repository.save(USER_EXISTING);
        await expect(repository.isUsernameAlreadyUsed(USER_EXISTING.name)).resolves.toBeTruthy();
    });
});