import { CommandDispatcher, InternalCommandDispatcher } from "../../sharedKernel/commandDispatcher";

export type Dependencies = Readonly<{
  commandDispatcher: CommandDispatcher,
}>;

export const serviceLocator = (): Dependencies => {

  const commandDispatcher = new InternalCommandDispatcher();
  commandDispatcher.registerHandlers({});

  return {
      commandDispatcher
  };
} 