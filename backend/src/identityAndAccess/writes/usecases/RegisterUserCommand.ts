import { Command } from "../../../sharedKernel/command";

export class RegisterUserCommand implements Command {
    constructor(readonly name: string,
        readonly email: string,
        readonly password: string) {
    }
}
