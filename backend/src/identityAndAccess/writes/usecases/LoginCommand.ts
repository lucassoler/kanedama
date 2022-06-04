import { Command } from "../../../sharedKernel/command";

export class LoginCommand implements Command {
    constructor(readonly login: string,
        readonly password: string) {
    }
}

export type LoginCommandResponse = {
    name: string
}