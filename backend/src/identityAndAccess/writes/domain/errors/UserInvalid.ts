import { DomainError } from "../../../../sharedKernel/domainError";
import IdentityErrorCodes from "./IdentityErrorCodes";

export class UserInvalid extends DomainError {
    readonly errors: Array<DomainError>;
    readonly code = IdentityErrorCodes.UserInvalid;

    constructor(errors: Array<DomainError>) {
        super("user is invalid for the following reasons : " + errors.map(x => x.message).join(","));
        this.errors = errors;
    }
}
