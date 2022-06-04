import { DataSource } from "typeorm";
import { NodeEnvironmentVariables } from "../../../../../configuration/environment/environmentVariables";
import { getDataSource } from "../../../../../configuration/typeorm/connection";
import { UserEntity } from "../../../../../configuration/typeorm/entities/UserEntity";
import { UserRepositoryTypeOrm } from "../../../../writes/driven/repositories/UserRepositoryTypeOrm";
import { FakeUuidGenerator } from "../../../../writes/driven/services/FakeUuidGenerator";

describe('UserRepositoryTypeOrm - IsEmailAlreadyUsed', () => {
    let repository: UserRepositoryTypeOrm;
    let fakeUuidGenerator: FakeUuidGenerator;
    let dataSource: DataSource;

    const USER_EXISTING = {
        id: "4fa55646-2541-4c96-b51f-aa4a824c239d",
        name: "Jane Doe",
        email: "jane.doe_1234@gmail.com",
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

    test('should return false if no user exists with this email', async () => {
        await expect(repository.isEmailAlreadyUsed(USER_EXISTING.email)).resolves.toBeFalsy();
    });

    test('should return true if a user already exists with this email', async () => {
        await repository.save(USER_EXISTING);
        await expect(repository.isEmailAlreadyUsed(USER_EXISTING.email)).resolves.toBeTruthy();
    });
});