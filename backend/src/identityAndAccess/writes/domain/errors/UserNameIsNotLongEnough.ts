import { DomainError } from "../../../../sharedKernel/domainError";
import IdentityErrorCodes from "./IdentityErrorCodes";

export class UserNameIsNotLongEnough extends DomainError {
    readonly code = IdentityErrorCodes.UserNameIsNotLongEnough;

    constructor(name: string) {
        super(`username "${name}" is not long enough`);
    }
}
