import { DomainError } from "../../../../sharedKernel/domainError";
import IdentityErrorCodes from "./IdentityErrorCodes";

export class UserNameAlreadyUsed extends DomainError {
    readonly code = IdentityErrorCodes.UserNameAlreadyUsed;

    constructor(name: string) {
        super(`name "${name}" is already used by another registered user`);
    }
}
