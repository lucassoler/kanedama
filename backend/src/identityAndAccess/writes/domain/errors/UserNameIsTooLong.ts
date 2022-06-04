import { DomainError } from "../../../../sharedKernel/domainError";
import IdentityErrorCodes from "./IdentityErrorCodes";

export class UserNameIsTooLong extends DomainError {
    readonly code = IdentityErrorCodes.UserNameIsTooLong;

    constructor(name: string) {
        super(`username "${name}" is too long`);
    }
}
