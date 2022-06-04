import { DomainError } from "../../../../sharedKernel/domainError";
import IdentityErrorCodes from "./IdentityErrorCodes";

export class PasswordIsTooLong extends DomainError {
    readonly code = IdentityErrorCodes.PasswordIsTooLong;

    constructor(name: string) {
        super(`password "${name}" is too long`);
    }
}
