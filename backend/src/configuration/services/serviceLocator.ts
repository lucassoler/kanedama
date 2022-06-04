import { identityAndAccessCommands } from "../../identityAndAccess/configuration/commands";
import { CreateUserFactory } from "../../identityAndAccess/writes/domain/services/CreateUserFactory";
import { UserRepositoryInMemory } from "../../identityAndAccess/writes/driven/repositories/UserRepositoryInMemory";
import { FakeEncryptionService } from "../../identityAndAccess/writes/driven/services/FakeEncryptionService";
import { CommandDispatcher, InternalCommandDispatcher } from "../../sharedKernel/commandDispatcher";
import { EnvironmentVariables, NodeEnvironmentVariables } from "../environment/environmentVariables";

export type Dependencies = Readonly<{
  commandDispatcher: CommandDispatcher,
  environmentVariables: EnvironmentVariables
}>;

export const serviceLocator = (): Dependencies => {

  const userRepository = new UserRepositoryInMemory();
  const encryptionService = new FakeEncryptionService();
  const createUserFactory = new CreateUserFactory(userRepository, encryptionService);

  const commandDispatcher = new InternalCommandDispatcher();
  commandDispatcher.registerHandlers({
    ...identityAndAccessCommands(userRepository, createUserFactory)
  });

  const environmentVariables = new NodeEnvironmentVariables();

  return {
      commandDispatcher,
      environmentVariables
  };
}