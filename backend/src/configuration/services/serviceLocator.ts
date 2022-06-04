import { DataSource } from "typeorm";
import { identityAndAccessCommands } from "../../identityAndAccess/configuration/commands";
import { CreateUserFactory } from "../../identityAndAccess/writes/domain/services/CreateUserFactory";
import { UserRepositoryInMemory } from "../../identityAndAccess/writes/driven/repositories/UserRepositoryInMemory";
import { UserRepositoryTypeOrm } from "../../identityAndAccess/writes/driven/repositories/UserRepositoryTypeOrm";
import { BcryptEncryptionService } from "../../identityAndAccess/writes/driven/services/BcryptEncryptionService";
import { FakeEncryptionService } from "../../identityAndAccess/writes/driven/services/FakeEncryptionService";
import { V4UuidGenerator } from "../../identityAndAccess/writes/driven/services/V4UuidGenerator";
import { CommandDispatcher, InternalCommandDispatcher } from "../../sharedKernel/commandDispatcher";
import { EnvironmentVariables, NodeEnvironmentVariables } from "../environment/environmentVariables";
import { getDataSource } from "../typeorm/connection";

export type Dependencies = Readonly<{
  commandDispatcher: CommandDispatcher,
  environmentVariables: EnvironmentVariables,
  dataSource: DataSource
}>;

export const serviceLocator = (): Dependencies => {

  const environmentVariables = new NodeEnvironmentVariables();
  const dataSource = getDataSource(environmentVariables);

  const userRepository = new UserRepositoryTypeOrm(new V4UuidGenerator(), dataSource);
  const encryptionService = new BcryptEncryptionService(environmentVariables);
  const createUserFactory = new CreateUserFactory(userRepository, encryptionService);

  const commandDispatcher = new InternalCommandDispatcher();
  commandDispatcher.registerHandlers({
    ...identityAndAccessCommands(userRepository, createUserFactory)
  });

  return {
      commandDispatcher,
      environmentVariables,
      dataSource
  };
}