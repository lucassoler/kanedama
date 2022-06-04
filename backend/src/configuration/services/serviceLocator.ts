import { DataSource } from "typeorm";
import { identityAndAccessCommands } from "../../identityAndAccess/configuration/commands";
import { CreateUserFactory } from "../../identityAndAccess/writes/domain/services/CreateUserFactory";
import { UserRepositoryTypeOrm } from "../../identityAndAccess/writes/driven/repositories/UserRepositoryTypeOrm";
import { BcryptEncryptionService } from "../../identityAndAccess/writes/driven/services/BcryptEncryptionService";
import { V4UuidGenerator } from "../../identityAndAccess/writes/driven/services/V4UuidGenerator";
import { CommandDispatcher, InternalCommandDispatcher } from "../../sharedKernel/commandDispatcher";
import { Logger, WinstonLogger } from "../../sharedKernel/services/logger";
import { EnvironmentVariables, NodeEnvironmentVariables } from "../environment/environmentVariables";
import { getDataSource } from "../typeorm/connection";

export type Dependencies = Readonly<{
  commandDispatcher: CommandDispatcher,
  environmentVariables: EnvironmentVariables,
  dataSource: DataSource,
  logger: Logger
}>;

export const serviceLocator = (): Dependencies => {

  const environmentVariables = new NodeEnvironmentVariables();
  const dataSource = getDataSource(environmentVariables);
  const logger = new WinstonLogger(environmentVariables);

  const userRepository = new UserRepositoryTypeOrm(new V4UuidGenerator(), dataSource);
  const encryptionService = new BcryptEncryptionService(environmentVariables);
  const createUserFactory = new CreateUserFactory(userRepository, encryptionService);

  const commandDispatcher = new InternalCommandDispatcher();
  commandDispatcher.registerHandlers({
    ...identityAndAccessCommands(userRepository, createUserFactory, encryptionService)
  });

  return {
      commandDispatcher,
      environmentVariables,
      dataSource,
      logger
  };
}