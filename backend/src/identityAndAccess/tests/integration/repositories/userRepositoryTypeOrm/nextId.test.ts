import { NodeEnvironmentVariables } from "../../../../../configuration/environment/environmentVariables";
import { getDataSource } from "../../../../../configuration/typeorm/connection";
import { UserRepositoryTypeOrm } from "../../../../writes/driven/repositories/UserRepositoryTypeOrm";
import { FakeUuidGenerator } from "../../../../writes/driven/services/FakeUuidGenerator";

describe('UserRepositoryTypeOrm - NextId', () => {
    let repository: UserRepositoryTypeOrm;
    let fakeUuidGenerator: FakeUuidGenerator;

    beforeEach(() => {
        fakeUuidGenerator = new FakeUuidGenerator();
        repository = new UserRepositoryTypeOrm(fakeUuidGenerator, getDataSource(new NodeEnvironmentVariables()));
    });

    test('should return a new uuid', async () => {
        fakeUuidGenerator.nextUuidToReturn = "99f15128-bd29-41cf-b5ee-5c10f09f3127";
        const id = await repository.nextId();
        expect(id).toBe("99f15128-bd29-41cf-b5ee-5c10f09f3127");
    });
});

