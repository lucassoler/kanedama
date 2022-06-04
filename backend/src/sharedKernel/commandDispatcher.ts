import { Command } from "./command";
import { CommandHandler } from "./commandHandler";

export interface RegisteredCommandHandler {
    [command: string]: CommandHandler
} 

export interface CommandDispatcherMiddleware {
    handle(command: Command): Promise<void>;
}

export interface CommandDispatcher {
    registerMiddleware(middlewares: CommandDispatcherMiddleware[]): CommandDispatcher;
    registerHandlers(handlers: RegisteredCommandHandler): CommandDispatcher;
    dispatch<R = void>(command: Command): Promise<R>;
}

export class ErrorCommandNotRegistered extends Error {
    constructor(command: string) {
        super(`The dispatcher command ${command} is not registered`);
    }
}

export class InternalCommandDispatcher implements CommandDispatcher {
    private handlers: RegisteredCommandHandler = {};
    private middlewares: CommandDispatcherMiddleware[] = [];

    registerMiddleware(middlewares: CommandDispatcherMiddleware[]): CommandDispatcher {
        this.middlewares = middlewares;
        return this;
    }
    
    registerHandlers(handlers: RegisteredCommandHandler): CommandDispatcher {
        this.handlers = handlers;
        return this;
    }

    async dispatch<R = void>(command: Command): Promise<R> {
        if (this.handlers[command.constructor.name] === undefined) {
            throw new ErrorCommandNotRegistered(command.constructor.name);
        }

        for (let index = 0; index < this.middlewares.length; index++) {
            const middleware = this.middlewares[index];
            await middleware.handle(command);
        }

        return await this.handlers[command.constructor.name].handle(command);
    }
}