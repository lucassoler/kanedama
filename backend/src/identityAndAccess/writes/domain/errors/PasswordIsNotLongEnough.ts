import { DomainError } from "../../../../sharedKernel/domainError";
import IdentityErrorCodes from "./IdentityErrorCodes";

export class PasswordIsNotLongEnough extends DomainError {
    readonly code = IdentityErrorCodes.PasswordIsNotLongEnough;

    constructor(name: string) {
        super(`password "${name}" is not long enough`);
    }
}
