import { CommandDispatcher, InternalCommandDispatcher } from "../../sharedKernel/commandDispatcher";
import { EnvironmentVariables, NodeEnvironmentVariables } from "../environment/environmentVariables";

export type Dependencies = Readonly<{
  commandDispatcher: CommandDispatcher,
  environmentVariables: EnvironmentVariables
}>;

export const serviceLocator = (): Dependencies => {

  const commandDispatcher = new InternalCommandDispatcher();
  commandDispatcher.registerHandlers({});

  const environmentVariables = new NodeEnvironmentVariables();

  return {
      commandDispatcher,
      environmentVariables
  };
}