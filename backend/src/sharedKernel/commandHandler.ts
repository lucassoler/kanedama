import { Command } from "./command";

export interface CommandHandler<Response = void | any> {
    handle(command:Command): Promise<Response>;
}