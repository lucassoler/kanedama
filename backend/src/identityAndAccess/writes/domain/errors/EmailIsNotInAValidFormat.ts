import { DomainError } from "../../../../sharedKernel/domainError";
import IdentityErrorCodes from "./IdentityErrorCodes";

export class EmailIsNotInAValidFormat extends DomainError {
    readonly code = IdentityErrorCodes.EmailIsNotInAValidFormat;

    constructor(email: string) {
        super(`email "${email}" is not a valid email format`);
    }
}
